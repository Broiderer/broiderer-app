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

    console.log(pointsPerLines)

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
        let prevPoints: Stitch[] = [];

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const pointsToDraw = pointsPerLines[key].slice(levelIndex).slice(0, 2)
            const points = i % 2 === 1 ? pointsToDraw.reverse() : pointsToDraw;
            if (points.length > 0 && prevPoints.length > 0 && points.every(pt => distance(prevPoints[0], pt) > gap * 2 && distance(prevPoints[1] || prevPoints[0], pt) > gap * 2)) {
                points[points.length - 1].isSkip = true
            }
            stitchesInOrder = stitchesInOrder.concat(points);
            if (points.length > 0) {
                prevPoints = points.concat()
            }
        }

        stitchesInOrder[stitchesInOrder.length - 1].isSkip = true
        levelIndex += 2;
    }

    /* let splittedStitches: Stitch[][] = [];
    let indexTmp = 0
    stitchesInOrder.forEach((stitch, i) => {
        if (stitch.isSkip) {
            splittedStitches.push(stitchesInOrder.slice(indexTmp, i + 1));
            indexTmp = i + 1;
        }
    })

    splittedStitches.push(stitchesInOrder.slice(indexTmp, stitchesInOrder.length - 1))

    if (splittedStitches.length === 0) {
        splittedStitches = [stitchesInOrder]
    }

    console.log(splittedStitches.length)

    const splittedStitchesOrdered: Stitch[][] = splittedStitches.slice(0, 1)
    const splittedStitchesTmp = splittedStitches.slice() */
    /* while (splittedStitchesOrdered.length < splittedStitches.length) {
        const [closestGroup, closestIndex] = getClosestStitchesArrayStartToPoint(splittedStitchesTmp, splittedStitchesOrdered[splittedStitchesOrdered.length - 1][splittedStitchesOrdered[splittedStitchesOrdered.length - 1].length - 1])
        splittedStitchesTmp.splice(closestIndex, 1)
        splittedStitchesOrdered.push(closestGroup)
    } */

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

const getClosestStitchesArrayStartToPoint = (stitches: Stitch[][], point: Position) => {
    let closestDistance: number | null = null;
    let closestIndex: number = 0;
    stitches.forEach((stitchGroup, i) => {
      if (closestDistance === null) {
        closestDistance = 10000000;
        closestIndex = i
      } else {
        const distLast = distance({x: point.x, y: point.y}, stitchGroup[stitchGroup.length - 1]);
        const distFirst = distance({x: point.x, y: point.y}, stitchGroup[0]);
        if (distLast < closestDistance) {
          closestDistance = distLast;
          closestIndex = i;
        }
        if (distFirst < closestDistance) {
            closestDistance = distFirst;
            closestIndex = i;
          }
      }
    })
    return [stitches[closestIndex], closestIndex] as [Stitch[], number];
  }