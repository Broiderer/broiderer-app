export const subdividePath = (path: SVGPathElement, steps: number): SVGPathElement[] => {
    const length = path.getTotalLength();
    const subPaths: SVGPathElement[] = [];
    const segmentsCount = Math.trunc(length / (steps + 1));
    const segmentLength = length / segmentsCount;

    for (let i = 0; i < segmentsCount; i++) {
        const from = path.getPointAtLength(i * segmentLength)
        const to = path.getPointAtLength((i + 1) * segmentLength)
        
        const newPath = path.cloneNode() as SVGPathElement
        newPath.setAttribute('d', `M${from.x + 5} ${from.y}, L${to.x} ${to.y}`);
        subPaths.push(newPath)
    }
    return subPaths;
}