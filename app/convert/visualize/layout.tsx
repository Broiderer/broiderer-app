import Footer from '@/app/components/footer/footer'
import Header from '@/app/components/header/header'
import styles from './styles.module.scss'
import Editor from '@/app/components/editor/editor'

export default function VisualizeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className={styles.visualize}>
        <Header></Header>
        <div className={styles['visualize-content']}>
          <Editor></Editor>
        </div>
        <Footer></Footer>
      </main>
    </>
  )
}
