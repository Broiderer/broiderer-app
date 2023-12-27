export default function getPathChildren(node: paper.Item, copyPaths: boolean = false): (paper.Path | paper.CompoundPath)[] {
    if (isPathItem(node)) {
        let newNode = node
        if (copyPaths) {
            newNode = node.clone({insert: false, deep: false})
            newNode.data['broiderer-import-id'] = node.id
        }

        return [
            newNode,
            ...(node.children || []).map(child => getPathChildren(child, copyPaths)).flat()
        ]
    }

    return (node.children || []).map(child => getPathChildren(child, copyPaths)).flat()
}

function isPathItem(item: paper.Item): item is paper.Path | paper.CompoundPath {
    return Boolean((<paper.Path>item)?.pathData)
}

export function setPathsInitialIds(item: paper.Item): void {
    if (isPathItem(item)) {
        item.data['broiderer-import-id'] = item.id
    }
   (item.children || []).map(setPathsInitialIds)
}