import paper from 'paper'

export type Position = { x: number; y: number }
type Stitch = Position & { isSkip?: boolean }
type LineStitches = { [key: string]: Stitch[] }
export type LinearFilling = {
  type: 'linear'
  angle: number
  gap: number
  innerGap: number
}
export type RadialFilling = {
  type: 'radial'
  angle: number
  around: { x: number; y: number }
  innerGap: number
}
export type AlongFilling = {
  type: 'along'
  path: paper.Path
  gap: number
  offset: number
  innerGap: number
}
export type Filling = LinearFilling | RadialFilling | AlongFilling

export const getStitches = (
  path: paper.Path | paper.CompoundPath,
  filling: Filling = { type: 'linear', angle: 0, gap: 2, innerGap: 20 }
) => {
  const pointsPerLines: LineStitches = {}

  const bounds =
    paper.project.layers.find(
      (layer) => layer.name === 'broiderer-embroidery-zone'
    )?.bounds || path.bounds

  let gridLinePaths = []

  switch (filling.type) {
    case 'linear':
      gridLinePaths = getParallelsForAngle(filling.angle, bounds, filling.gap)
      break
    case 'radial':
      gridLinePaths = getRadialLines(
        filling.angle,
        filling.around,
        bounds,
        path
      )
      break
    case 'along':
      gridLinePaths = getLinesAlongPath(
        filling.path,
        filling.gap,
        bounds,
        filling.offset
      )
      break
  }

  gridLinePaths.forEach((linePath) => {
    const int = linePath.getIntersections(path)
    if (int.length > 0) {
      const roundedInters = int.map((inter) => ({
        x: Number(inter.point.x.toFixed(2)),
        y: Number(inter.point.y.toFixed(2)),
      }))
      const uniqueInters = roundedInters.filter(
        (inter, i, self) =>
          self
            .map((pos) => `${pos.x}:${pos.y}`)
            .indexOf(`${inter.x}:${inter.y}`) === i
      )
      pointsPerLines[`${int[0].point.x}:${int[0].point.y}`] = uniqueInters
    }
  })

  Object.keys(pointsPerLines).forEach((key) => {
    pointsPerLines[key].sort((pointA, pointB) => pointA.y - pointB.y)
  })

  const maxLevelIndex = Math.max(
    ...Object.values(pointsPerLines).map((pts) => pts.length)
  )
  let stitchesInOrder: Stitch[] = []
  let levelIndex = 0
  while (levelIndex < maxLevelIndex) {
    const keys = Object.keys(pointsPerLines)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const pointsToDraw = pointsPerLines[key].slice(levelIndex).slice(0, 2)
      const points = i % 2 === 1 ? pointsToDraw.reverse() : pointsToDraw
      const nextKey = keys[i + 1]
      if (
        points.length > 0 &&
        (!nextKey ||
          pointsPerLines[nextKey].length !== pointsPerLines[key].length)
      ) {
        points[points.length - 1].isSkip = true
      }

      const filledPoints: Stitch[] = points
        .map((point, i, self) => {
          if (point.isSkip || i === self.length - 1) {
            return point
          }
          return [
            point,
            ...getStitchesInBetween(
              point,
              self[i + 1],
              filling.innerGap,
              false
            ),
          ]
        })
        .flat()
      stitchesInOrder = stitchesInOrder.concat(filledPoints)
    }

    levelIndex += 2
  }

  const simplifiedStitches: Stitch[] = []
  let lastStitchedIndex = 1
  stitchesInOrder.forEach((stitch, i, self) => {
    if (simplifiedStitches.length === 0) {
      simplifiedStitches.push(stitch)
    }
    if (distance(stitch, self[lastStitchedIndex]) < 2) {
      return
    }
    simplifiedStitches.push(stitch)
    lastStitchedIndex = i
  })

  return stitchesInOrder

  /*    const skipSplits: Stitch[][] = [];
    let prevStitchIndex = 0;
    for (let i = 0; i < stitchesInOrder.length; i++) {
        if (stitchesInOrder[i].isSkip || i === stitchesInOrder.length - 1) {
            skipSplits.push(stitchesInOrder.slice(prevStitchIndex === 0 ? prevStitchIndex : prevStitchIndex + 1, i + 1))
            prevStitchIndex = i;
        }
    }

    console.log(skipSplits)

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
    return reorderedSkips.flat().map((point, i, self) => (point.isSkip || i === self.length - 1) ? point : [point, ...getStitchesInBetween(point, self[i + 1], gap, false)]).flat(); */
}

/* function getClosestSplitIndex(split: Stitch[], splits: Stitch[][]): number {
  let closestIndex = 0
  let distanceToClosest = distanceToSplit(split, splits[0])
  splits.forEach((splitTmp, i) => {
    if (distanceToSplit(split, splitTmp) < distanceToClosest) {
      closestIndex = i
      distanceToClosest = distanceToSplit(split, splitTmp)
    }
  })
  return closestIndex
} */

/* function distanceToSplit(splitA: Stitch[], splitB: Stitch[]): number {
  return Math.min(distance(splitA[splitA.length - 1], splitB[0]))
} */

export function distance(pointA: Position, pointB: Position) {
  return Math.sqrt(
    Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
  )
}

export const getDataForStitches = (stitches: Stitch[]) => {
  let fillPath = ''
  for (let i = 0; i < stitches.length; i++) {
    const point = stitches[i]
    if (!fillPath) {
      fillPath += `M${point.x} ${point.y}`
    } else {
      fillPath += ` L${point.x} ${point.y}`
    }
    if (i === stitches.length - 1) {
      fillPath += 'z'
    }
  }

  return fillPath
}

const getStitchesInBetween = (
  stitchA: Stitch,
  stitchB: Stitch,
  gap: number,
  randomizeFirstFillingStep: boolean
): Stitch[] => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute(
    'd',
    `M${stitchA.x} ${stitchA.y} L${stitchB.x} ${stitchB.y}`
  )
  const length = path.getTotalLength()
  if (gap >= length) {
    return []
  } else {
    const inbetweenStitches = []
    let index = randomizeFirstFillingStep
      ? Math.min(length / 2, Math.random() * gap)
      : 0
    while (index < length) {
      const point = path.getPointAtLength(index)
      inbetweenStitches.push({ x: point.x, y: point.y })
      index += gap
    }
    return inbetweenStitches
  }
}

function getParallelsForAngle(
  angle: number,
  bounds: paper.Layer['bounds'],
  gap: number
) {
  const guideline = new paper.Path([
    [0, 0],
    [0, 2 * Math.sqrt(2) * bounds.width],
  ])

  guideline.rotate((angle * 180) / Math.PI, new paper.Point([0, 0]))

  const tangent = guideline.getTangentAt(0)

  guideline.translate(tangent.multiply(-Math.sqrt(2) * bounds.width))

  return getLinesAlongPath(guideline, gap, bounds, Math.sqrt(2) * bounds.width)
}

function getRadialLines(
  angle: number,
  around: { x: number; y: number },
  bounds: paper.Layer['bounds'],
  path: paper.Path | paper.CompoundPath
): paper.Path[] {
  const rotatedLines = []
  const initial = new paper.Path(
    `M${around.x} ${around.y} L${around.x + bounds.width * Math.sqrt(2)} ${
      around.y
    }`
  )

  for (let i = 0; i < Math.PI; i += angle) {
    const rotatedLine = initial.clone({ insert: false })
    rotatedLine.rotate((i * 360) / (2 * Math.PI), around)
    const symetry = rotatedLine.clone({ insert: false })
    symetry.rotate(180, around)
    rotatedLine.join(symetry)
    if (path.bounds.intersects(rotatedLine.bounds)) {
      rotatedLines.push(rotatedLine)
    }
  }

  return rotatedLines
}

function getLinesAlongPath(
  path: paper.Path,
  gap: number,
  bounds: paper.Layer['bounds'],
  offset: number
): paper.Path[] {
  const pathLength = path.length

  const lines: paper.Path[] = []
  for (let i = 0; i < pathLength; i += gap) {
    const normal = path.getNormalAt(i)
    const line = new paper.Path([
      path.getPointAt(i).subtract(normal),
      path.getPointAt(i).add(normal.multiply(2 * offset)),
    ])
    line.translate(path.getNormalAt(i).subtract(normal.multiply(offset)))
    lines.push(line)
  }

  return lines
}
