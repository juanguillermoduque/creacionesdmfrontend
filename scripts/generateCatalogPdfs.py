#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
import math
import re
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    Image as RLImage,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
CATALOG_DIR = ROOT / "catalogo"
PDF_DIR = CATALOG_DIR / "pdf"
THUMB_DIR = ROOT / ".catalog-work" / "pdf-thumbs"
DATA_FILE = ROOT / "public" / "data" / "store-catalog.json"
LOGO_FILE = ROOT / "public" / "assets" / "creaciones-dm-logo.png"

INK = colors.HexColor("#181818")
MINT = colors.HexColor("#63cbbb")
MINT_LIGHT = colors.HexColor("#d7f5ed")
IVORY = colors.HexColor("#fffaf4")
LINE = colors.HexColor("#ddd6cf")
MUTED = colors.HexColor("#5f5f5f")
YELLOW = colors.HexColor("#f7d36d")


def load_catalog() -> dict:
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
      return list(csv.DictReader(handle))


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[áàäâ]", "a", value)
    value = re.sub(r"[éèëê]", "e", value)
    value = re.sub(r"[íìïî]", "i", value)
    value = re.sub(r"[óòöô]", "o", value)
    value = re.sub(r"[úùüû]", "u", value)
    value = re.sub(r"ñ", "n", value)
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "catalogo"


def paragraph_style(name: str, size: int, leading: int, color=INK, bold=False, align=TA_LEFT):
    return ParagraphStyle(
        name,
        fontName="Helvetica-Bold" if bold else "Helvetica",
        fontSize=size,
        leading=leading,
        textColor=color,
        alignment=align,
        spaceAfter=8,
    )


styles = getSampleStyleSheet()
styles.add(paragraph_style("TitleDM", 30, 34, INK, True))
styles.add(paragraph_style("SubtitleDM", 12, 17, MUTED))
styles.add(paragraph_style("HeadingDM", 18, 23, INK, True))
styles.add(paragraph_style("SmallDM", 8, 11, MUTED))
styles.add(paragraph_style("BodyDM", 10, 14, INK))
styles.add(paragraph_style("CellDM", 8, 10, INK))
styles.add(paragraph_style("CellSmallDM", 7, 9, MUTED))
styles.add(paragraph_style("CenterDM", 9, 12, INK, False, TA_CENTER))


def clean_text(value: object) -> str:
    text = str(value or "")
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def doc_template(path: Path, title: str) -> SimpleDocTemplate:
    return SimpleDocTemplate(
        str(path),
        pagesize=A4,
        rightMargin=1.35 * cm,
        leftMargin=1.35 * cm,
        topMargin=1.45 * cm,
        bottomMargin=1.45 * cm,
        title=title,
        author="Creaciones DM",
        subject="Catálogo de productos personalizados",
    )


def draw_doc_footer(c: canvas.Canvas, doc):
    width, _height = A4
    c.saveState()
    c.setStrokeColor(LINE)
    c.line(1.35 * cm, 1.05 * cm, width - 1.35 * cm, 1.05 * cm)
    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawString(1.35 * cm, 0.65 * cm, "Creaciones DM - Catálogo personalizado")
    c.drawRightString(width - 1.35 * cm, 0.65 * cm, f"Página {doc.page}")
    c.restoreState()


def cover(title: str, subtitle: str, totals: list[tuple[str, str]]) -> list:
    table_data = [[Paragraph(clean_text(label), styles["CellDM"]), Paragraph(clean_text(value), styles["CellDM"])] for label, value in totals]
    table = Table(table_data, colWidths=[7.2 * cm, 7.2 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), IVORY),
                ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return [
        Spacer(1, 1.3 * cm),
        Paragraph("CREACIONES DM", paragraph_style("Brand", 11, 14, MINT, True, TA_CENTER)),
        Spacer(1, 0.45 * cm),
        Paragraph(clean_text(title), styles["TitleDM"]),
        Paragraph(clean_text(subtitle), styles["SubtitleDM"]),
        Spacer(1, 0.75 * cm),
        table,
        Spacer(1, 0.5 * cm),
        Paragraph(f"Generado el {datetime.now().strftime('%Y-%m-%d')}", styles["SmallDM"]),
        PageBreak(),
    ]


def styled_table(headers: list[str], rows: list[list[object]], widths: list[float]) -> Table:
    data = [[Paragraph(clean_text(header), styles["CellDM"]) for header in headers]]
    data.extend([[Paragraph(clean_text(cell), styles["CellSmallDM"]) for cell in row] for row in rows])
    table = Table(data, colWidths=widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), MINT_LIGHT),
                ("TEXTCOLOR", (0, 0), (-1, 0), INK),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("BOX", (0, 0), (-1, -1), 0.6, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.25, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def representative_items(items: list[dict], group_key: str, total: int, per_group: int = 2) -> list[dict]:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for item in items:
        grouped[item[group_key]].append(item)

    for group in grouped.values():
        group.sort(key=lambda item: (item["collection"], item["title"]))

    selected: list[dict] = []
    for group_name in sorted(grouped, key=lambda key: (-len(grouped[key]), key)):
        selected.extend(grouped[group_name][:per_group])
        if len(selected) >= total:
            return selected[:total]

    return selected[:total]


def image_flowable(item: dict, max_width: float, max_height: float) -> RLImage:
    image_path = ensure_thumb(item)
    with Image.open(image_path) as image:
        width, height = image.size
    scale = min(max_width / width, max_height / height)
    return RLImage(str(image_path), width=width * scale, height=height * scale)


def gallery_cell(item: dict, image_width: float, image_height: float) -> list:
    title = item["title"][:54] + ("..." if len(item["title"]) > 54 else "")
    meta = f"{item['occasion']} - {item['collection']}"
    return [
        image_flowable(item, image_width, image_height),
        Paragraph(clean_text(title), styles["CellDM"]),
        Paragraph(clean_text(meta), styles["CellSmallDM"]),
    ]


def gallery_table(items: list[dict], columns: int = 3) -> Table:
    col_width = 5.45 * cm
    image_width = col_width - 0.45 * cm
    image_height = 3.45 * cm
    rows = []

    for index in range(0, len(items), columns):
        row_items = items[index : index + columns]
        row = [gallery_cell(item, image_width, image_height) for item in row_items]
        row.extend([""] * (columns - len(row)))
        rows.append(row)

    table = Table(rows, colWidths=[col_width] * columns)
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.45, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, LINE),
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def build_master_pdf(catalog: dict):
    items = catalog["items"]
    by_product = Counter(item["productType"] for item in items).most_common()
    by_occasion = Counter(item["occasion"] for item in items).most_common()
    by_collection = Counter(item["collection"] for item in items).most_common()
    rows = read_csv(CATALOG_DIR / "catalogo-productos.csv")

    story = cover(
        "Catálogo maestro Creaciones DM",
        "Resumen comercial para productos personalizados, regalos empresariales y diseños disponibles.",
        [
            ("Diseños disponibles", f"{len(items):,}".replace(",", ".")),
            ("Tipos de producto con diseños", str(len(by_product))),
            ("Temáticas detectadas", str(len(by_occasion))),
            ("Colecciones base", str(len(by_collection))),
        ],
    )
    story.append(Paragraph("Líneas de producto", styles["HeadingDM"]))
    story.append(
        styled_table(
            ["Producto", "Estado", "Personalización"],
            [[row["producto"], row["estado"], row["personalizacion"]] for row in rows],
            [4.2 * cm, 3.6 * cm, 9 * cm],
        )
    )
    story.extend([Spacer(1, 0.5 * cm), Paragraph("Resumen por temática", styles["HeadingDM"])])
    story.append(styled_table(["Temática", "Diseños"], by_occasion, [9 * cm, 3 * cm]))
    story.extend([Spacer(1, 0.5 * cm), Paragraph("Colecciones principales", styles["HeadingDM"])])
    story.append(styled_table(["Colección", "Diseños"], by_collection[:12], [10 * cm, 3 * cm]))
    story.extend([Spacer(1, 0.5 * cm), Paragraph("Recomendación comercial", styles["HeadingDM"])])
    story.append(
        Paragraph(
            "Usar el home para presentar la marca y llevar a WhatsApp. Usar /catalogo como vitrina completa para filtrar por temática, producto o colección y enviar al cliente 3 a 6 opciones visuales.",
            styles["BodyDM"],
        )
    )
    story.extend(
        [
            PageBreak(),
            Paragraph("Muestra visual del catálogo", styles["HeadingDM"]),
            Paragraph("Selección de diseños representativos incluidos en la vitrina completa.", styles["BodyDM"]),
            gallery_table(representative_items(items, "occasion", total=12, per_group=2)),
        ]
    )

    path = PDF_DIR / "catalogo-maestro-creaciones-dm.pdf"
    doc_template(path, "Catálogo maestro Creaciones DM").build(story, onFirstPage=draw_doc_footer, onLaterPages=draw_doc_footer)
    return path


def build_product_pdf(catalog: dict):
    rows = read_csv(CATALOG_DIR / "catalogo-productos.csv")
    counts = Counter(item["productType"] for item in catalog["items"]).most_common()
    story = cover(
        "Catálogo por producto",
        "Productos y servicios que Creaciones DM puede ofrecer para personas, empresas, eventos y campañas.",
        [("Productos ofertables", str(len(rows))), ("Diseños disponibles", str(len(catalog["items"])))],
    )
    story.append(Paragraph("Productos ofertables", styles["HeadingDM"]))
    story.append(
        styled_table(
            ["Producto", "Estado", "Descripción", "Ocasiones sugeridas"],
            [[row["producto"], row["estado"], row["descripcion"], row["ocasiones_sugeridas"]] for row in rows],
            [3.2 * cm, 2.7 * cm, 7.1 * cm, 4.1 * cm],
        )
    )
    story.extend([Spacer(1, 0.5 * cm), Paragraph("Diseños actuales por producto", styles["HeadingDM"])])
    story.append(styled_table(["Producto", "Diseños"], counts, [10 * cm, 3 * cm]))
    items_by_product: dict[str, list[dict]] = defaultdict(list)
    for item in catalog["items"]:
        items_by_product[item["productType"]].append(item)

    for product, product_items in sorted(items_by_product.items(), key=lambda entry: (-len(entry[1]), entry[0])):
        story.extend(
            [
                PageBreak(),
                Paragraph(product, styles["HeadingDM"]),
                Paragraph(f"{len(product_items)} diseños disponibles. Muestra visual para cotización.", styles["BodyDM"]),
                gallery_table(sorted(product_items, key=lambda item: (item["occasion"], item["collection"], item["title"]))[:12]),
            ]
        )
    path = PDF_DIR / "catalogo-por-producto-creaciones-dm.pdf"
    doc_template(path, "Catálogo por producto Creaciones DM").build(story, onFirstPage=draw_doc_footer, onLaterPages=draw_doc_footer)
    return path


def build_theme_pdf(catalog: dict):
    rows = read_csv(CATALOG_DIR / "catalogo-tematicas.csv")
    by_collection = Counter(item["collection"] for item in catalog["items"]).most_common()
    story = cover(
        "Catálogo por temática",
        "Clasificación de diseños por ocasión, colección base y mensaje sugerido de cotización.",
        [("Temáticas", str(len(rows))), ("Colecciones", str(len(by_collection))), ("Diseños", str(len(catalog["items"])))],
    )
    story.append(Paragraph("Temáticas y ocasiones", styles["HeadingDM"]))
    story.append(
        styled_table(
            ["Temática", "Diseños", "Colecciones base"],
            [[row["tematica"], row["cantidad_disenos"], row["colecciones_base"]] for row in rows],
            [3.6 * cm, 2.2 * cm, 11 * cm],
        )
    )
    story.extend([Spacer(1, 0.5 * cm), Paragraph("Colecciones base", styles["HeadingDM"])])
    story.append(styled_table(["Colección", "Diseños"], by_collection, [10 * cm, 3 * cm]))
    items_by_occasion: dict[str, list[dict]] = defaultdict(list)
    for item in catalog["items"]:
        items_by_occasion[item["occasion"]].append(item)

    for occasion, occasion_items in sorted(items_by_occasion.items(), key=lambda entry: (-len(entry[1]), entry[0])):
        story.extend(
            [
                PageBreak(),
                Paragraph(occasion, styles["HeadingDM"]),
                Paragraph(f"{len(occasion_items)} diseños disponibles. Muestra visual por temática.", styles["BodyDM"]),
                gallery_table(sorted(occasion_items, key=lambda item: (item["collection"], item["title"]))[:12]),
            ]
        )
    path = PDF_DIR / "catalogo-por-tematica-creaciones-dm.pdf"
    doc_template(path, "Catálogo por temática Creaciones DM").build(story, onFirstPage=draw_doc_footer, onLaterPages=draw_doc_footer)
    return path


def ensure_thumb(item: dict) -> Path:
    source = ROOT / "public" / item["image"].lstrip("/")
    target = THUMB_DIR / f"{item['id']}.jpg"
    if target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
        return target

    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        image = image.convert("RGB")
        image.thumbnail((700, 520), Image.Resampling.LANCZOS)
        canvas_image = Image.new("RGB", image.size, "white")
        canvas_image.paste(image, (0, 0))
        canvas_image.save(target, "JPEG", quality=76, optimize=True)
    return target


def draw_cover_page(c: canvas.Canvas, title: str, subtitle: str, totals: list[tuple[str, str]], size):
    width, height = size
    c.setFillColor(IVORY)
    c.rect(0, 0, width, height, fill=1, stroke=0)
    c.setFillColor(MINT_LIGHT)
    c.circle(width * 0.86, height * 0.85, 4.5 * cm, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#fde7dc"))
    c.circle(width * 0.14, height * 0.18, 3.2 * cm, fill=1, stroke=0)
    if LOGO_FILE.exists():
        c.drawImage(str(LOGO_FILE), 2.1 * cm, height - 4.3 * cm, 2.5 * cm, 2.5 * cm, preserveAspectRatio=True, mask="auto")
    c.setFillColor(MINT)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(5 * cm, height - 2.7 * cm, "CREACIONES DM")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 34)
    c.drawString(2.1 * cm, height - 6 * cm, title)
    c.setFont("Helvetica", 15)
    c.setFillColor(MUTED)
    c.drawString(2.1 * cm, height - 7.05 * cm, subtitle)
    x = 2.1 * cm
    y = height - 9.4 * cm
    box_w = 5 * cm
    for label, value in totals:
        c.setFillColor(colors.white)
        c.roundRect(x, y, box_w, 1.8 * cm, 6, fill=1, stroke=0)
        c.setFillColor(MINT)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(x + 0.35 * cm, y + 0.95 * cm, value)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 8)
        c.drawString(x + 0.35 * cm, y + 0.45 * cm, label)
        x += box_w + 0.45 * cm
    c.showPage()


def draw_visual_footer(c: canvas.Canvas, page: int, title: str, size):
    width, _height = size
    c.setStrokeColor(LINE)
    c.line(1.2 * cm, 0.85 * cm, width - 1.2 * cm, 0.85 * cm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.5)
    c.drawString(1.2 * cm, 0.45 * cm, "Creaciones DM - Catálogo visual")
    c.drawCentredString(width / 2, 0.45 * cm, title)
    c.drawRightString(width - 1.2 * cm, 0.45 * cm, f"Página {page}")


def draw_card(c: canvas.Canvas, item: dict, x: float, y: float, w: float, h: float):
    c.setFillColor(colors.white)
    c.setStrokeColor(LINE)
    c.roundRect(x, y, w, h, 5, fill=1, stroke=1)

    img_path = ensure_thumb(item)
    img_x = x + 0.18 * cm
    img_y = y + 1.15 * cm
    img_w = w - 0.36 * cm
    img_h = h - 1.55 * cm
    c.drawImage(str(img_path), img_x, img_y, img_w, img_h, preserveAspectRatio=True, anchor="c")

    c.setFillColor(IVORY)
    c.rect(x, y, w, 1 * cm, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 7.4)
    title = item["title"][:48] + ("..." if len(item["title"]) > 48 else "")
    c.drawString(x + 0.2 * cm, y + 0.58 * cm, title)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.4)
    c.drawString(x + 0.2 * cm, y + 0.23 * cm, f"{item['occasion']} - {item['collection'][:34]}")


def build_visual_pdf(catalog: dict):
    items_by_occasion: dict[str, list[dict]] = defaultdict(list)
    for item in catalog["items"]:
        items_by_occasion[item["occasion"]].append(item)

    sorted_occasions = sorted(items_by_occasion, key=lambda key: (-len(items_by_occasion[key]), key))
    size = landscape(A4)
    width, height = size
    path = PDF_DIR / "catalogo-visual-completo-creaciones-dm.pdf"
    c = canvas.Canvas(str(path), pagesize=size)
    c.setTitle("Catálogo visual completo Creaciones DM")
    c.setAuthor("Creaciones DM")
    draw_cover_page(
        c,
        "Catálogo visual completo",
        "Diseños disponibles por temática, colección y producto.",
        [
            ("diseños", f"{len(catalog['items']):,}".replace(",", ".")),
            ("temáticas", str(len(sorted_occasions))),
            ("colecciones", str(len(catalog["collections"]))),
        ],
        size,
    )

    page = 1
    margin_x = 1.2 * cm
    top = height - 1.3 * cm
    card_gap = 0.35 * cm
    cols = 4
    rows = 3
    card_w = (width - (2 * margin_x) - (card_gap * (cols - 1))) / cols
    card_h = 5.1 * cm
    y_start = top - 1.2 * cm - card_h

    for occasion in sorted_occasions:
        items = sorted(items_by_occasion[occasion], key=lambda item: (item["collection"], item["title"]))
        total_pages = math.ceil(len(items) / (cols * rows))
        for page_index in range(total_pages):
            c.setFillColor(colors.white)
            c.rect(0, 0, width, height, fill=1, stroke=0)
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 18)
            c.drawString(margin_x, top, occasion)
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 9)
            c.drawRightString(width - margin_x, top, f"{len(items)} diseños - página {page_index + 1} de {total_pages}")

            slice_items = items[page_index * cols * rows : (page_index + 1) * cols * rows]
            for index, item in enumerate(slice_items):
                col = index % cols
                row = index // cols
                x = margin_x + col * (card_w + card_gap)
                y = y_start - row * (card_h + card_gap)
                draw_card(c, item, x, y, card_w, card_h)
            draw_visual_footer(c, page, occasion, size)
            c.showPage()
            page += 1

    c.save()
    return path


def main():
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    THUMB_DIR.mkdir(parents=True, exist_ok=True)
    catalog = load_catalog()

    paths = [
        build_master_pdf(catalog),
        build_product_pdf(catalog),
        build_theme_pdf(catalog),
        build_visual_pdf(catalog),
    ]
    print(json.dumps({"outputDir": str(PDF_DIR), "files": [path.name for path in paths]}, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
