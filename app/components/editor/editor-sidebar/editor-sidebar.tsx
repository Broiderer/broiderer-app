import { useState } from 'react'
import { Logo } from '../../logo/logo'
import { EditorSettings } from '../editor'
import EditorSidebarFormGrid from './editor-sidebar-forms/editor-sidebar-form-grid/editor-sidebar-form-grid'
import EditorSidebarFromSvg from './editor-sidebar-forms/editor-sidebar-form-svg/editor-sidebar-form-svg'
import EditorSidebarSection from './editor-sidebar-section/editor-sidebar-section'
import styles from './editor-sidebar.module.scss'
import EditorSidebarToggle from './editro-sidebar-toggle/editro-sidebar-toggle'
import EditorSidebarFormDownload, {
  ExportFormat,
} from './editor-sidebar-forms/editor-sidebar-form-download/editor-sidebar-form-download'
import * as paper from 'paper'
import * as svgo from 'svgo'
import downloadFile from '../utils/download'

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || 'https://guillaumemmm.pythonanywhere.com'

async function uploadFile(file: File) {
  const extensionFrom = file.name.split('.').pop()

  const formData = new FormData()
  formData.append('file', file)

  return fetch(
    `${apiUrl}/convert?extensionFrom=${extensionFrom}&extensionTo=pes`,
    {
      method: 'POST',
      body: formData,
    }
  )
}

export default function EditorSidebar({
  settings,
  updateSettings,
}: {
  settings: EditorSettings
  updateSettings: (settings: EditorSettings) => void
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false)

  function handleGridSettingsChange(gridSettings: EditorSettings['grid']) {
    updateSettings({ ...settings, grid: gridSettings })
  }

  function handleImportedImportChange(
    importSettings: EditorSettings['import']
  ) {
    updateSettings({ ...settings, import: importSettings })
  }

  function sidebarToggleHandle() {
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }

  async function downloadClickedHandle(format: ExportFormat) {
    const stitchLayer = paper.project.layers.find(
      (layer) => layer.name === 'broiderer-test-stitch'
    )
    if (!stitchLayer) {
      return
    }
    const savedLayer = stitchLayer.clone({ insert: false })

    savedLayer.children = savedLayer.children.filter((child) =>
      Boolean(child.data['broiderer-import-id'])
    )

    const svgStr = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="500px" height="500px">${
      savedLayer.exportSVG({
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
    console.log(optimizedData)
    switch (format) {
      case 'svg': {
        downloadFile(
          `${settings.import.initialName || 'broiderer_embroidery'}.svg`,
          optimizedData
        )
        break
      }
      case 'pes': {
        setLoadingDownload(true)
        const blob = new Blob([optimizedData], { type: 'text/plain' })
        const file = new File(
          [blob],
          `${settings.import.initialName || 'broiderer_embroidery'}.svg`,
          { type: 'text/plain' }
        )

        const response = await uploadFile(file)
        const convertedFileUrl = await response.text()

        const downloadUrl = `${apiUrl}${convertedFileUrl}`
        var a = document.createElement('a')
        a.href = downloadUrl
        a.setAttribute('download', 'file')
        a.setAttribute('target', '_blank')
        document.body.appendChild(a)
        a.click()
        a.parentElement?.removeChild(a)

        setLoadingDownload(false)
        break
      }
    }
  }

  return (
    <div
      className={`${styles['sidebar-container']} ${
        isOpen ? '' : styles['sidebar-container-closed']
      }`}
    >
      <div className={styles['sidebar-header']}>
        <div className={styles['sidebar-header-logo']}>
          <Logo
            withName
            nameClassName={styles['sidebar-header-logo-name']}
          ></Logo>
        </div>
        <div className={styles['sidebar-header-toggle']}>
          <EditorSidebarToggle
            isSidebarOpen={isOpen}
            onToggleClicked={sidebarToggleHandle}
          ></EditorSidebarToggle>
        </div>
      </div>
      <div className={styles['sidebar-sections']}>
        <EditorSidebarSection
          title="Import"
          iconClassName="bro-icon-upload"
          initiallyOpened={true}
        >
          <EditorSidebarFromSvg
            settings={settings['import']}
            updateImportSettings={handleImportedImportChange}
          ></EditorSidebarFromSvg>
        </EditorSidebarSection>
        <EditorSidebarSection
          title="Editor"
          iconClassName="bro-icon-grid"
          initiallyOpened={false}
        >
          <EditorSidebarFormGrid
            gridSettings={settings.grid}
            updateGridSettings={handleGridSettingsChange}
          ></EditorSidebarFormGrid>
        </EditorSidebarSection>
        <EditorSidebarSection
          title="Download"
          iconClassName="bro-icon-save"
          initiallyOpened={false}
        >
          <EditorSidebarFormDownload
            onDownloadClicked={downloadClickedHandle}
            loadingDownload={loadingDownload}
          ></EditorSidebarFormDownload>
        </EditorSidebarSection>
      </div>
    </div>
  )
}
