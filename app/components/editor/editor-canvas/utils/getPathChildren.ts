export default function getPathChildren(
  node: paper.Item,
  copyPaths: boolean = false
): (paper.Path | paper.CompoundPath)[] {
  if (isCompoundPathItem(node)) {
    const nodes = node.children.filter(isPathItem)
    const subtracted = nodes
      .slice(1)
      .reduce(
        (acc, curr) => acc.subtract(curr, { insert: false }) as paper.Path,
        nodes[0]
      )
    return subtracted.length > 0 ? [subtracted] : []
  }

  if (isPathItem(node)) {
    let newNode = node
    if (copyPaths) {
      newNode = node.clone({ insert: false, deep: false })
      newNode.data['broiderer-import-id'] = node.id
    }

    return [
      newNode,
      ...(node.children || [])
        .map((child) => getPathChildren(child, copyPaths))
        .flat(),
    ]
  }

  return (node.children || [])
    .map((child) => getPathChildren(child, copyPaths))
    .flat()
}

function isPathItem(item: paper.Item): item is paper.Path {
  return Boolean((<paper.Path>item)?.pathData)
}

function isCompoundPathItem(item: paper.Item): item is paper.CompoundPath {
  return isPathItem(item) && item.children && item.children.length > 1
}

export function setPathsInitialIds(item: paper.Item): void {
  if (isPathItem(item)) {
    item.data['broiderer-import-id'] = item.id
  }
  ;(item.children || []).map(setPathsInitialIds)
}
