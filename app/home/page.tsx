import Converter from '../components/converter/converter';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import styles from './styles.module.scss';

export default function Home() {
    return (
      <main className={styles.home}>
        <Header></Header>
        <Converter></Converter>
        <Footer></Footer>
      </main>
    )
  }
  