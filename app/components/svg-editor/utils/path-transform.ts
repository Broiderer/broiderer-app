import * as svgson from 'svgson';
import { SvgTransformOptions } from '../svg-editor';

export const getSvgDataForOptions = (svgData: svgson.INode, options: SvgTransformOptions, document: Document): svgson.INode => {

    const paths = getPathsInSvg(svgData)

    const newSvgData: svgson.INode = {...svgData, children: svgData.children.map(child => {
        if (paths.includes(child)) {
            child.attributes.stroke = options.path.stroke;
            child = getChildGroupForPaths(child, document, options.path.step)
        }
        return child;
    })}

    return newSvgData
}

const getPathsInSvg = (node: svgson.INode): svgson.INode[] => {
    if (node.name === 'path') {
        return [node];
    }
    if (['svg', 'g'].includes(node.name)) {
        return node.children.map(child => getPathsInSvg(child)).flat();
    }
    return []
}

const getChildGroupForPaths = (child: svgson.INode, document: Document, stepLength: number): svgson.INode => {

    const childrenPaths: svgson.INode[] = [];

    const pathElm = document.createElementNS('http://www.w3.org/2000/svg',"path")
    pathElm.setAttribute('d', child.attributes.d);
    const length = pathElm.getTotalLength();

    for (let i = 0; i < Math.trunc(length / stepLength); i++) {
        childrenPaths.push({...child, attributes: {
            ...child.attributes, 
            d: getDAttributeForSubPath(pathElm, stepLength, i)
        }})
    }
    
    const newChild: svgson.INode = {
        name: 'g',
        type: 'element',
        value: '',
        attributes: {},
        children: childrenPaths
    }

    return newChild
}


const getDAttributeForSubPath = (pathElm: SVGPathElement, stepLength: number, index: number): string => {
    const pointStart = pathElm.getPointAtLength(stepLength * index);
    const pointEnd = pathElm.getPointAtLength(stepLength * (index + 1));

    return `M${pointStart.x} ${pointStart.y}, L${pointEnd.x} ${pointEnd.y}`
}