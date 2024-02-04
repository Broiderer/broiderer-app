export function getPathChildren(node: paper.Item) {
  return node.getItems({
    match: (item: paper.Item) => isPathItem(item) && !item.children,
  }) as (paper.Path | paper.CompoundPath)[]
}

export function isPathItem(item: paper.Item): item is paper.Path {
  return Boolean((<paper.Path>item)?.pathData)
}

function isCompoundPathItem(item: paper.Item): item is paper.CompoundPath {
  return isPathItem(item) && item.children && item.children.length > 1
}

export function setPathsInitialIds(item: paper.Item): void {
  if (isPathItem(item)) {
    item.data['broiderer-import-id'] = item.id
  }
  if (isCompoundPathItem(item)) {
    for (const child of item.children) {
      child.data['broiderer-import-id'] = item.id
    }
    return
  }
  ;(item.children || []).map(setPathsInitialIds)
}
