import { useState } from 'react'
import styles from './editor-sidebar-form-download.module.scss'
import SelectOptions from '@/app/components/form/select/select'

export type ExportFormat = 'svg' | 'pes'

export default function EditorSidebarFormDownload({
  onDownloadClicked,
  loadingDownload,
}: {
  onDownloadClicked: (format: ExportFormat) => void
  loadingDownload: boolean
}) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pes')

  return (
    <div className={styles['editor-sidebar-form-download']}>
      <div className={styles['editor-sidebar-form-download-select']}>
        <SelectOptions
          value={exportFormat}
          options={['pes', 'svg']}
          onValueChange={(val) => setExportFormat(val as ExportFormat)}
        ></SelectOptions>
      </div>
      <div className={styles['editor-sidebar-form-download-button']}>
        <button
          className={`bro-button bro-button-primary ${
            loadingDownload ? 'bro-button-loading' : ''
          }`}
          disabled={loadingDownload}
          type="button"
          onClick={() => onDownloadClicked(exportFormat)}
        >
          📂&nbsp;Download
        </button>
      </div>
    </div>
  )
}
