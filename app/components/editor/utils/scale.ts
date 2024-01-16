export enum CanvasScale {
  PX = 'px',
  CM = 'cm',
  MM = 'mm',
}

export function scaleToPx(
  value: number,
  scale: CanvasScale,
  dpi: number
): number {
  switch (scale) {
    case CanvasScale.CM:
      return (value * dpi) / 2.54

    case CanvasScale.MM:
      return (value * dpi) / 25.4

    case CanvasScale.PX:
      return value

    default:
      return value
  }
}

export function pxToScale(
  value: number,
  scale: CanvasScale,
  dpi: number
): number {
  switch (scale) {
    case CanvasScale.CM:
      return (value * 2.54) / dpi

    case CanvasScale.MM:
      return (value * 25.4) / dpi

    case CanvasScale.PX:
      return value

    default:
      return value
  }
}
