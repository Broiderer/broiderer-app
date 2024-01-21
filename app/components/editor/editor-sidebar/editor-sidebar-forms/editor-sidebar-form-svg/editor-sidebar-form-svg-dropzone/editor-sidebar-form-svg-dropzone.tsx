import { useDropzone } from 'react-dropzone'
import styles from './editor-sidebar-form-svg-dropzone.module.scss'
import { EditorSettings } from '@/app/components/editor/editor'

export default function EditorSidebarFormSvgDropzone({
  onFileInput,
}: {
  onFileInput: (file: File) => void
}) {
  const onDrop = (acceptedFiles: File[]) => {
    onFileInput(acceptedFiles[0])
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/svg+xml': ['.svg'] },
    maxSize: 25_000,
  })

  return (
    <div className={styles['svg-dropzone']} {...getRootProps()}>
      <label>
        Drop a .svg file here <span>(max 25kB)</span>
      </label>
      <input type="file" {...getInputProps()}></input>
    </div>
  )
}
