import Editor from '../components/editor/editor'
import styles from './styles.module.scss'

export default function Create() {
  return (
    <main className={styles.create}>
      <div className={styles['create-content']}>
        <Editor></Editor>
      </div>
    </main>
  )
}
