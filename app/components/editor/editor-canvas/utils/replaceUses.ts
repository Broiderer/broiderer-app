export function replaceUses(data: string) {
  const el = document.createElement('div')
  el.innerHTML = data
  const uses = el.getElementsByTagName('use')
  let index = -1
  for (const use of Array.from(uses)) {
    index++
    const id = use.getAttribute('xlink:href')
    if (!id || id[0] !== '#') {
      continue
    }
    const replacement = el.querySelector(id)?.cloneNode(true) as SVGElement
    if (replacement) {
      replacement.setAttribute('id', `${id.slice(1)}-copy-${index}`)
      replacement.setAttribute(
        'transform',
        `${use.getAttribute('transform') ?? ''}${
          replacement.getAttribute('transform') ?? ''
        }`
      )
      use.parentElement?.replaceChild(replacement, use)
    }
  }
  return el.innerHTML
}
