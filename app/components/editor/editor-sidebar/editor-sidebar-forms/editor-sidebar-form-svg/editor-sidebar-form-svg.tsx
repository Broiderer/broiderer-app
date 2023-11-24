import { ChangeEvent } from 'react'
import { EditorSettings } from '../../../editor'
import * as svgo from 'svgo'

export default function EditorSidebarFromSvg({
  updateImportSettings,
}: {
  updateImportSettings: (settings: EditorSettings['import']) => void
}) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    const file = (target.files || [])[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const svgContent = e.target?.result as string
        if (svgContent) {
          const optimizedData = svgo.optimize(svgContent, {
            js2svg: { indent: 2, pretty: true },
            plugins: [
              'cleanupAttrs',
              'cleanupEnableBackground',
              'cleanupIds',
              { name: 'cleanupListOfValues', params: { convertToPx: true } },
              { name: 'cleanupNumericValues', params: { convertToPx: true } },
              'collapseGroups',
              {
                name: 'convertColors',
                params: { names2hex: true, rgb2hex: true },
              },
              {
                name: 'convertPathData',
                params: {
                  applyTransforms: true,
                  applyTransformsStroked: true,
                  convertToZ: true,
                  removeUseless: true,
                },
              },
              { name: 'convertShapeToPath', params: { convertArcs: true } },
              'convertStyleToAttrs',
              'inlineStyles',
              'removeComments',
              'removeDesc',
              'removeDoctype',
              'removeDimensions',
              'removeEditorsNSData',
              'removeEmptyContainers',
              'removeEmptyText',
              'removeHiddenElems',
              'removeMetadata',
              'removeNonInheritableGroupAttrs',
              'removeOffCanvasPaths',
              'removeRasterImages',
              'removeScriptElement',
              'removeStyleElement',
              'removeUnknownsAndDefaults',
              'removeUnusedNS',
              'removeUselessDefs',
              {
                name: 'removeAttrs',
                params: {
                  attrs: ['*:stroke:*', '*:stroke-width:*'],
                },
              },
            ],
          }).data

          updateImportSettings({
            initialSvg: optimizedData,
          })
        }
      }

      reader.readAsText(file)
    }
  }

  return (
    <form>
      <div>
        <input type="file" id="svgInput" onChange={handleFileChange} />
        <label htmlFor="svgInput">Import SVG</label>
      </div>
    </form>
  )
}
