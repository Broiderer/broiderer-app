type Position = {x: number, y: number};
type Stitch = Position & {isSkip?: boolean};
type LineStitches = {[key: number]: Stitch[]}

export const getStiches = (pathData: string, gap: number, fillGap: number = 0, randomizeFirstFillingStep: boolean = false) => {

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', pathData);

    const pointsPerLines: LineStitches = {}

    //  Create a gap-spaced vertical grid
    const gridPathsX = Array(Math.round(3000 / gap)).fill(null).map((_, i) => i * gap);
    const length = path.getTotalLength();

    let index = 0;
    let prevPos: Position | null = null;
    while (index < length) {
        const localPos = path.getPointAtLength(index);
        
        const matchingPoint = !prevPos ? gridPathsX.find(pos => pos === localPos.x) : gridPathsX.find(pos => (localPos.x >= pos && prevPos!.x < pos) || (localPos.x <= pos && prevPos!.x > pos))

        if ((matchingPoint || matchingPoint === 0) && distance(prevPos || localPos, localPos) <= gap + 1) {
            //  If the point is on the grid, save it
            pointsPerLines[matchingPoint] = (pointsPerLines[matchingPoint] || []).concat({x: matchingPoint, y: localPos.y})
        }
        prevPos = localPos
        index ++;
    }

    Object.keys(pointsPerLines).forEach((key, i) => {
        const keyTmp = key as any as keyof LineStitches;
        pointsPerLines[keyTmp].sort((pointA, pointB) => pointA.y - pointB.y)
    })

    const maxLevelIndex = Math.max(...Object.values(pointsPerLines).map(pts => pts.length))

    let stitchesInOrder: Stitch[] = [];
    let levelIndex = 0;
    while (levelIndex < maxLevelIndex) {
        const keys = Object.keys(pointsPerLines).map(Number)
        keys.sort((keyA, keyB) => keyA - keyB)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const pointsToDraw = pointsPerLines[key].slice(levelIndex).slice(0, 2)
            const points = i % 2 === 1 ? pointsToDraw.reverse() : pointsToDraw;
            if (points.length === 0 || (i === 0 && stitchesInOrder.length > 0)) {
                stitchesInOrder[stitchesInOrder.length - 1].isSkip = true;
            }
    
            stitchesInOrder = stitchesInOrder.concat(points);
        }
    
        levelIndex += 2;
    }

    if (fillGap) {
        let filledStitchesInOrder: Stitch[] = [];
        stitchesInOrder.forEach((stitch, i) => {
            if (i > 0) {
                const prevStitch = stitchesInOrder[i - 1];
                if (prevStitch.isSkip) {
                    filledStitchesInOrder = filledStitchesInOrder.concat(prevStitch)
                } else {
                    filledStitchesInOrder = filledStitchesInOrder.concat(
                        getStitchesInBetween(stitchesInOrder[i - 1], stitch, fillGap, true, randomizeFirstFillingStep)
                    )
                }
            }
        })
        
        stitchesInOrder = filledStitchesInOrder.concat(stitchesInOrder[stitchesInOrder.length - 1]);
    }
    return stitchesInOrder;
}

export function distance(pointA: Position, pointB: Position) {
    return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2))
}

export const getDataForStitches = (stitches: Stitch[]) => {
    let fillPath = '';
    for (let i = 0; i < stitches.length; i++) {
        const point = stitches[i]
        if (!fillPath) {
            fillPath += `M${point.x} ${point.y}`;
        } else {
            fillPath += ` L${point.x} ${point.y}`;
        }
        if (i === stitches.length - 1) {
            fillPath += 'z';
        }
    }

    return fillPath;
}

const getStitchesInBetween = (stitchA: Stitch, stitchB: Stitch, gap: number, includeLimits: boolean, randomizeFirstFillingStep: boolean): Stitch[] => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', `M${stitchA.x} ${stitchA.y} L${stitchB.x} ${stitchB.y}`);
    const length = path.getTotalLength();
    if (gap >= length) {
        return includeLimits ? [stitchA, stitchB] : [];
    } else {
        const inbetweenStitches = [];
        let index = randomizeFirstFillingStep ? Math.min(length / 2, Math.random() * gap) : 0;
        while (index < length) {
            const point = path.getPointAtLength(index);
            inbetweenStitches.push({x: point.x, y: point.y})
            index += gap
        }
        return inbetweenStitches
    }
}