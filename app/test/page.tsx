
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import TestEditor2 from '../components/test-editor-2/test-editor-2';
import styles from './styles.module.scss';

export default function Test() {
    return (
      <main className={styles.test}>
        <Header></Header>
        <div className={styles.content}>
         <TestEditor2></TestEditor2>
        </div>
        <Footer></Footer>
      </main>
    )
  }
  