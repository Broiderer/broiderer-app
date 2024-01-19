import Footer from '../components/footer/footer'
import Header from '../components/header/header'
import styles from './styles.module.scss'
import Versions from './versions/versions'

export default function Documentation() {
  return (
    <div className={styles['documentation']}>
      <Header></Header>
      <main className={styles['documentation-content']}>
        <h1 className="bro-title">Documentation</h1>
        <p>🚧 This section is WIP 🚧</p>
        <section className={styles['documentation-section']}>
          <Versions></Versions>
        </section>
      </main>
      <Footer></Footer>
    </div>
  )
}
