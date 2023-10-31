"use client";
import { useEffect, useRef } from "react";
import styles from "./test-editor-2.module.scss";
import paper from "paper";
import elementToPath from "./utils/elementToPaperPath";
import { distance, getDataForStitches } from "./utils/fillStitches2";
import { subdividePathForPaperPath } from "./utils/subdividePath";
import { getStiches } from "./utils/fillStitches3";
paper.setup(new paper.Size(1, 1));
paper.view.autoUpdate = false;

const ALLOWED_TAGS = [
  "rect",
  "circle",
  "polygon",
  "polyline",
  "ellipse",
  "path",
];
const OUTLINE_STEP = 5;
const FILL_STEP = 1;
const GRID_STEP = 2;
const ADDITIONAL_STITCH_START = 2;
const ADDITIONAL_STITCH_END = 2;
const RANDOMIZE_FIRST_FILLING_STEP = false;

const getAllNodes = (svgElement: SVGElement): SVGElement[] => {
  if (!svgElement) {
    return [];
  }
  return (ALLOWED_TAGS.includes(svgElement.tagName) ? [svgElement] : [])
    .concat([
      ...(Array.from(svgElement.childNodes) as any).map((node: SVGElement) =>
        getAllNodes(node)
      ),
    ])
    .flat();
};

export default function TestEditor2() {
  const svgRef = useRef<SVGSVGElement>(null);
  const svgPaperRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgPaperRef.current || !svgRef.current) {
      return;
    }

    if (svgRef.current.getAttribute("viewBox")) {
      svgPaperRef.current.setAttribute(
        "viewBox",
        svgRef.current.getAttribute("viewBox")!
      );
    }

    if (svgRef.current.getAttribute("width")) {
      svgPaperRef.current.setAttribute(
        "width",
        svgRef.current.getAttribute("width")!
      );
    }

    if (svgRef.current.getAttribute("height")) {
      svgPaperRef.current.setAttribute(
        "height",
        svgRef.current.getAttribute("height")!
      );
    }

    svgPaperRef.current.innerHTML = "";

    const allNodes = getAllNodes(svgRef.current as any as SVGElement);

    const paperPaths = allNodes
      .map((originalNode, i) => {
        const { pathData, attributes } = elementToPath(originalNode);
        if (pathData) {
          const pathElmTest = new paper.CompoundPath(pathData);
          pathElmTest.data.fill = attributes.fill;
          pathElmTest.data.id = `shape-${i + 1}`;
          pathElmTest.closePath();

          return pathElmTest;
        } else {
          return null;
        }
      })
      .filter((el) => !!el);

    const isolatedPaths: paper.Path[] = [];
    paperPaths.forEach((path, i) => {
      if (!path) {
        return new paper.Path();
      }
      let pathT: paper.PathItem = path.clone();
      paperPaths.slice(i + 1).forEach((pathTmp) => {
        pathT = pathT.subtract(pathTmp!);
      });
      /* pathT.flatten(1); */
      isolatedPaths.push(pathT as paper.Path);
    });

    const strokePaths = isolatedPaths.map((path) => {
      const newPath = subdividePathForPaperPath(path.clone(), OUTLINE_STEP);
      newPath.data.fill = "transparent";
      newPath.data.stroke = path?.data.fill;
      return newPath;
    });

    const stitchedPaths = isolatedPaths.map((path) => {
      /* const stitches = getStiches(
        path.clone()!.pathData,
        GRID_STEP,
        FILL_STEP,
        RANDOMIZE_FIRST_FILLING_STEP
      ); */
      const stitches = getStiches(
        path.clone(),
        GRID_STEP,
      );

      const filteredStitches = stitches //  no filter anymore

      const newData = getDataForStitches(filteredStitches);
      const newPath = new paper.Path();
      newPath.pathData = newData;
      newPath.data.fill = "transparent";
      newPath.data.stroke = path?.data.fill;
      return newPath;
    });

    [...stitchedPaths, ...strokePaths].filter(path => !!path && path.firstSegment).forEach((path) => {
      for (let i = 0; i < ADDITIONAL_STITCH_START; i++) {
        path.insert(0, path.firstSegment.clone());
      }
      for (let i = 0; i < ADDITIONAL_STITCH_END; i++) {
        path.add(path.lastSegment.clone());
      }
    });

    const allPaths = stitchedPaths;

   /*  strokePaths.forEach((path) => {
      const matchIndex = stitchedPaths.findIndex(
        (stitchPath) => stitchPath.data.id === path.id
      );
      allPaths.splice(matchIndex, 0, path);
    }); */

    const getClosestPathStartToPoint = (paths: paper.Path[], point: paper.Point) => {
      let closestDistance: number | null = null;
      let closestIndex: number = 0;
      paths.forEach((path, i) => {
        if (closestDistance === null) {
          closestDistance = 10000000;
          closestIndex = i
        } else {
          if (path.lastSegment) {
            const dist = distance({x: point.x, y: point.y}, path.lastSegment.point);
            const dist2 = distance({x: point.x, y: point.y}, path.firstSegment.point);
            if (dist < closestDistance) {
              closestDistance = dist;
              closestIndex = i;
            }

            if (dist2 < closestDistance) {
              closestDistance = dist2;
              closestIndex = i;
            }
          }
        }
      })
      return [paths[closestIndex], closestIndex] as [paper.Path, number];
    }
    let allPathsTmp = allPaths.slice()
    const orderedPaths = allPathsTmp.slice(0, 1);
    for (let i = 1; i < allPaths.length; i++) {
      if (orderedPaths[orderedPaths.length - 1].lastSegment) {
        const [closestPath, closestPathIndex]: [paper.Path, number] = getClosestPathStartToPoint(allPathsTmp, orderedPaths[orderedPaths.length - 1].lastSegment.point)
        allPathsTmp.splice(closestPathIndex, 1)
        orderedPaths.push(closestPath)
      }
    }

    const finalPath = new paper.Path();
    orderedPaths.forEach((path) => {
      finalPath.addSegments(path.segments);
    });

    const pathElm = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    pathElm.setAttribute("fill", "transparent");
    pathElm.setAttribute("stroke", "black");
    pathElm.setAttribute("stroke-width", "0.5px");
    pathElm.setAttribute("d", finalPath!.pathData);

    svgPaperRef.current?.appendChild(pathElm);
  }, [svgPaperRef, svgRef]);

  const downloadPath = () => {
    console.log(svgPaperRef.current?.outerHTML);
  };

  return (
    <div className={styles["editor-svg"]}>
      <div id="test-editor-svg" className={styles["test-editor-svg"]}>
      <svg version="1.0" xmlns="http://www.w3.org/2000/svg" ref={svgRef}
 width="500" height="500">
    {/* <rect width="200" height="50" x="10" y="10" stroke="red"></rect>
    <rect width="200" height="50" x="50" y="100" fill="red"></rect>
    <rect width="200" height="50" x="80" y="180" fill="red"></rect>
    <rect width="200" height="50" x="20" y="250" fill="red"></rect>
    <circle r="50" cx="250" cy="200" fill="red"></circle> */}
    <path d="M 58.5 60 L 432 60 L 468 288 L 99 294 L 58.5 60 M 261 198 L 292.5 240 L 373.5 174 L 274.5 156 Z M 319.5 246 L 342 276 L 454.5 276 L 414 234 L 369 216 Z M 142 202 L 200 154 L 177 106 L 87 104 Z M 230 226 L 138 234 L 114 274 L 322 279 Z M 249 144 L 402 142 L 397 92 L 204 101 Z M 197 213 L 251 204 L 243 163 L 158 208 Z M 416 150 L 369 200 L 443 219 Z"></path>
    {/* <path d="M 75 69 L 75 245 L 397 245 L 397 69 Z M 138 113 L 196 113 L 198 162 L 139 163 Z"></path> */}
</svg>
      </div>

      <svg
        id="test-zone"
        xmlns="http://www.w3.org/2000/svg"
        ref={svgPaperRef}
      ></svg>
      <button onClick={downloadPath}>Download svg</button>
    </div>
  );
}
