import paper from "paper";

export type Position = {x: number, y: number};
type Stitch = Position & {isSkip?: boolean};
type LineStitches = {[key: number]: Stitch[]}

export const getStiches = (path: paper.Path, gap: number) => {

    const pointsPerLines: LineStitches = {}

    let gridPathData = ``
    const bounds = path.bounds
    for (let i = 0; i <= bounds.width; i += gap) {
        gridPathData += `M${bounds.x + i} ${bounds.y} L${bounds.x + i} ${bounds.y + bounds.height}`
    }
    const gridPath = new paper.CompoundPath(gridPathData)

    const intersections = gridPath.getIntersections(path)
    for (const intersectionPoint of intersections) {
        pointsPerLines[intersectionPoint.point.x] = (pointsPerLines[intersectionPoint.point.x] || []).concat(intersectionPoint.point)
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
            const nextKey = keys[i + 1]
            if (points.length > 0 && (!nextKey || pointsPerLines[nextKey].length !== pointsPerLines[key].length)) {
                points[points.length - 1].isSkip = true
            }
            stitchesInOrder = stitchesInOrder.concat(points);
        }

        levelIndex += 2;
    }

    const skipSplits: Stitch[][] = [];
    let prevStitchIndex = 0;
    for (let i = 0; i < stitchesInOrder.length; i++) {
        if (stitchesInOrder[i].isSkip || i === stitchesInOrder.length - 1) {
            skipSplits.push(stitchesInOrder.slice(prevStitchIndex === 0 ? prevStitchIndex : prevStitchIndex + 1, i + 1))
            prevStitchIndex = i;
        }
    }

    const splitsTmp = skipSplits.concat()
    const reorderedSkips = [];

    while (splitsTmp.length > 0) {
        if (reorderedSkips.length === 0) {
            reorderedSkips.push(splitsTmp[0]);
            continue;
        }
        let closestSplitIndex = getClosestSplitIndex(reorderedSkips[reorderedSkips.length - 1], splitsTmp)
        reorderedSkips.push(splitsTmp[closestSplitIndex])
        splitsTmp.splice(closestSplitIndex, 1)
    }

    return reorderedSkips.flat().map((point, i, self) => (point.isSkip || i === self.length - 1) ? point : [point, ...getStitchesInBetween(point, self[i + 1], gap, false)]).flat();
}

function getClosestSplitIndex(split: Stitch[], splits: Stitch[][]): number {
    let closestIndex = 0
    let distanceToClosest = distanceToSplit(split, splits[0])
    splits.forEach((splitTmp, i) => {
        if (distanceToSplit(split, splitTmp) < distanceToClosest) {
            closestIndex = i
            distanceToClosest = distanceToSplit(split, splitTmp)
        }
    })
    return closestIndex
}

function distanceToSplit(splitA: Stitch[], splitB: Stitch[]): number {
    return Math.min(distance(splitA[splitA.length - 1], splitB[0]))
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

const getStitchesInBetween = (stitchA: Stitch, stitchB: Stitch, gap: number, randomizeFirstFillingStep: boolean): Stitch[] => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', `M${stitchA.x} ${stitchA.y} L${stitchB.x} ${stitchB.y}`);
    const length = path.getTotalLength();
    if (gap >= length) {
        return [];
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