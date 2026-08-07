interface XRSystem {
  isSessionSupported(mode: 'immersive-ar' | 'immersive-vr' | 'inline'): Promise<boolean>
}

interface Navigator {
  xr?: XRSystem
}
