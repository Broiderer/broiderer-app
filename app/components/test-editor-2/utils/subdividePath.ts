
import paper from "paper";
import { Position } from "./fillStitches2";

export const subdividePathForPaperPath = (
    path: paper.Path,
    gap: number
): paper.Path => {
    const pathElm = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElm.setAttribute('d', path.pathData);
    let newPathData = "";

    const length = path.length;
    const startPoint = pathElm.getPointAtLength(0);
    newPathData += `M${startPoint.x} ${startPoint.y}`;
  
    let coveredLength = gap;
    while (coveredLength < length) {
      coveredLength += gap;
      const point = pathElm.getPointAtLength(coveredLength);
      newPathData += ` L${point.x} ${point.y}`;
    }
  
    const lastPoint = pathElm.getPointAtLength(length);
    newPathData += ` L${lastPoint.x} ${lastPoint.y}Z`;
  
    return new paper.Path(newPathData);
}
