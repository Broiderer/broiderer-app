import { EditorSettings } from '../../../editor'
import * as svgo from 'svgo'
import { replaceUses } from '../../../editor-canvas/utils/replaceUses'
import EditorSidebarFormSvgDropzone from './editor-sidebar-form-svg-dropzone/editor-sidebar-form-svg-dropzone'

export default function EditorSidebarFormSvg({
  updateImportSettings,
}: {
  updateImportSettings: (settings: EditorSettings['import']) => void
}) {
  const handleFileChange = (file: File) => {
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
              'convertTransform',
              'removeComments',
              'removeDesc',
              'removeDoctype',
              'removeViewBox',
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

          const usesReplacedData = replaceUses(optimizedData)

          updateImportSettings({
            initialSvg: usesReplacedData,
          })
        }
      }

      reader.readAsText(file)
    }
  }

  return (
    <>
      <EditorSidebarFormSvgDropzone
        onFileInput={handleFileChange}
      ></EditorSidebarFormSvgDropzone>
    </>
  )
}
