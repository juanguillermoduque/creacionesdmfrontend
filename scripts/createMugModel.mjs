import { writeFile } from 'node:fs/promises';
import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  TorusGeometry,
} from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

globalThis.FileReader = class {
  async readAsArrayBuffer(blob) {
    this.result = await blob.arrayBuffer();
    this.onloadend?.({ target: this });
  }
};

const mug = new Group();

const ceramic = new MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.42,
  metalness: 0,
});

const accent = new MeshStandardMaterial({
  color: 0x9edfd1,
  roughness: 0.56,
  metalness: 0,
});

const body = new Mesh(new CylinderGeometry(0.48, 0.42, 0.74, 96, 1, false), ceramic);
body.position.y = 0.37;
mug.add(body);

const rim = new Mesh(new TorusGeometry(0.47, 0.035, 16, 96), ceramic);
rim.rotation.x = Math.PI / 2;
rim.position.y = 0.75;
mug.add(rim);

const base = new Mesh(new TorusGeometry(0.39, 0.03, 16, 96), ceramic);
base.rotation.x = Math.PI / 2;
base.position.y = 0.02;
mug.add(base);

const handle = new Mesh(new TorusGeometry(0.22, 0.035, 18, 80, Math.PI * 1.28), ceramic);
handle.rotation.y = Math.PI / 2;
handle.rotation.z = -0.15;
handle.position.set(0.47, 0.41, 0);
handle.scale.set(1, 1.45, 1);
mug.add(handle);

const printBand = new Mesh(new BoxGeometry(0.03, 0.34, 0.46), accent);
printBand.position.set(0, 0.38, -0.425);
printBand.rotation.z = -0.2;
mug.add(printBand);

const exporter = new GLTFExporter();
const result = await exporter.parseAsync(mug, { binary: true });
await writeFile(new URL('../public/models/creaciones-dm-mug.glb', import.meta.url), Buffer.from(result));
