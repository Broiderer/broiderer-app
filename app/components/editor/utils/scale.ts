export enum CanvasScale { PIXEL = 'PIXEL', CENTIMETER = 'CENTIMETER', MILLIMETER = 'MILLIMETER' }

export function scaleToPx(value: number, scale: CanvasScale, dpi: number): number {
    switch (scale) {
        case CanvasScale.CENTIMETER: return value * dpi / 2.54;

        case CanvasScale.MILLIMETER: return value * dpi / 25.4;
        
        case CanvasScale.PIXEL: return value

        default: return value
    }
}