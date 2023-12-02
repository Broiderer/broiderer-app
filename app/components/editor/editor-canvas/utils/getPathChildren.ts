export default function getPathChildren(node: paper.Item): paper.Path[] {
    if (isPathItem(node)) {
        const newNode = node.clone({insert: false, deep: false})
        return [
            newNode,
            ...(node.children || []).map(getPathChildren).flat()
        ]
    }

    return (node.children || []).map(getPathChildren).flat()
}

function isPathItem(item: paper.Item): item is paper.Path {
    return Boolean((<paper.Path>item)?.pathData)
}