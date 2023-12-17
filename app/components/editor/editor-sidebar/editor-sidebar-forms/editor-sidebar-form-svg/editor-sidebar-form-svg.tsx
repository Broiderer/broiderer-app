import { ChangeEvent } from 'react'
import { EditorSettings } from '../../../editor'
import * as svgo from 'svgo'
import * as paper from 'paper'
import downloadFile from '../../../utils/download'

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
          console.log(svgContent)
          const optimizedData = svgo.optimize(svgContent, {
            js2svg: { indent: 2, pretty: true },
            plugins: [
              /* 'cleanupAttrs',
              'cleanupEnableBackground',
              'cleanupIds',
              { name: 'cleanupListOfValues', params: { convertToPx: true } },
              { name: 'cleanupNumericValues', params: { convertToPx: true } },
              'collapseGroups',
              {
                name: 'convertColors',
                params: { names2hex: true, rgb2hex: true },
              }, */
              /* {
                name: 'convertPathData',
                params: {
                  applyTransforms: true,
                  applyTransformsStroked: true,
                  convertToZ: true,
                  removeUseless: true,
                },
              }, */
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

  function exportSvgClicked() {
    const testStitchLayer = paper.project.layers
      .find((layer) => layer.name === 'broiderer-test-stitch')
      ?.clone({ insert: false })
    if (!testStitchLayer) {
      return
    }

    testStitchLayer.children = testStitchLayer.children.filter(
      (child) => child.data['broiderer-import-id']
    )
    const svgStr = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500">${
      testStitchLayer.exportSVG({
        bounds: 'content',
        asString: true,
      }) as string
    }</svg>`
    const optimizedData = svgo.optimize(svgStr, {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              convertPathData: false,
            },
          },
        },
      ],
    }).data
    downloadFile('overlap_2.svg', optimizedData)
  }

  return (
    <form>
      <div>
        <input type="file" id="svgInput" onChange={handleFileChange} />
        <label htmlFor="svgInput">Import SVG</label>
      </div>
      <div>
        <button type="button" onClick={exportSvgClicked}>
          Export SVG
        </button>
      </div>
    </form>
  )
}
