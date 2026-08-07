import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        ar?: boolean
        'ar-modes'?: string
        'camera-controls'?: boolean
        exposure?: string
        'shadow-intensity'?: string
      }
    }
  }
}
