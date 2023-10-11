const chunkArray = (arr: unknown[], size = 2) => {
  let results = [];
  while (arr.length) {
    results.push(arr.splice(0, size));
  }
  return results;
};

const calcValue = (val: string | number, base: number): number => {
  return /%$/.test(val as string) ? ((val as any).replace("%", "") * 100) / base : +val;
};

const rect = (attrs: Record<string, string | number>) => {
  const w = +attrs.width;
  const h = +attrs.height;
  const x = attrs.x ? +attrs.x : 0;
  const y = attrs.y ? +attrs.y : 0;
  let rx = attrs.rx || "auto";
  let ry = attrs.ry || "auto";
  if (rx === "auto" && ry === "auto") {
    rx = ry = 0;
  } else if (rx !== "auto" && ry === "auto") {
    rx = ry = calcValue(rx, w);
  } else if (ry !== "auto" && rx === "auto") {
    ry = rx = calcValue(ry, h);
  } else {
    rx = calcValue(rx, w);
    ry = calcValue(ry, h);
  }
  if (rx > w / 2) {
    rx = w / 2;
  }
  if (ry > h / 2) {
    ry = h / 2;
  }
  const hasCurves = rx > 0 && ry > 0;
  return [
    `M${x + rx} ${y}`,
    `H${x + w - rx}`,
    ...(hasCurves ? [`A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}`] : []),
    `V${y + h - ry}`,
    ...(hasCurves ? [`A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}`] : []),
    `H${x + rx}`,
    ...(hasCurves ? [`A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}`] : []),
    `V${y + ry}`,
    ...(hasCurves ? [`A${rx} ${ry} 0 0 1 ${x + rx} ${y}`] : []),
    "z",
  ];
};

const ellipse = (attrs: Record<string, string | number>) => {
  const cx = +attrs.cx;
  const cy = +attrs.cy;
  const rx = attrs.rx ? +attrs.rx : +attrs.r;
  const ry = attrs.ry ? +attrs.ry : +attrs.r;
  return [
    `M${cx + rx} ${cy}`,
    `A${rx} ${ry} 0 0 1 ${cx} ${cy + ry}`,
    `A${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`,
    `A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`,
    "z",
  ];
};

const line = ({ x1, y1, x2, y2 }: Record<string, string | number>) => {
  return [`M${+x1} ${+y1}`, `L${+x2} ${+y2}`];
};

const poly = (attrs: Record<string, string | number>) => {
  const { points } = attrs;
  const pointsArray = (points as string)
    .trim()
    .split(" ")
    .reduce((arr: string[], point: string) => {
      return [
        ...arr,
        ...(point.includes(",")
          ? point.split(",")
          : point.trim() !== ""
          ? [point]
          : []),
      ];
    }, []);

  const pairs = chunkArray(pointsArray, 2);
  return pairs.map(([x, y], i) => {
    return `${i === 0 ? "M" : "L"}${x} ${y}`;
  });
};

const toPathString = (d: string | string[]) => {
  return Array.isArray(d) ? d.join(" ") : "";
};

const elementToPath = (
  element: SVGElement
) => {
    if (!element) {
        return {};
    }
    const tag = element.tagName;
    const attributes = Object.fromEntries(Array.from(element.attributes).map(item => [item.name, item.value]));

    let d;

    if (tag === "rect") {
        d = toPathString(rect(attributes));
    }

    if (tag === "circle" || tag === "ellipse") {
        d = toPathString(ellipse(attributes));
    }

    if (tag === "line") {
        d = toPathString(line(attributes));
    }

    if (tag === "polyline") {
        d = toPathString(poly(attributes));
    }

    if (tag === "polygon") {
        d = toPathString([...poly(attributes), "Z"]);
    }

    if (tag === "path") {
        d = attributes.d;
    }

    return { pathData: d, attributes: attributes };
};

export default elementToPath;
