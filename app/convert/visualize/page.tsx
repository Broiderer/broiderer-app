import Converter from "@/app/components/converter/converter";
import Footer from "@/app/components/footer/footer";
import Header from "@/app/components/header/header";
import SvgUploadZone from "@/app/components/svg-upload-zone/svg-upload-zone";
import styles from './styles.module.scss';

export default function Visualize() {
    return (
        <main className={styles.visualize}>
            <Header></Header>
            <div className={styles.content}>
                <h1 className="bro-title">Visualize your svg files</h1>
                <div className={styles['svg-upload-zone']}>
                    <SvgUploadZone></SvgUploadZone>
                </div>
                <div className={styles['visualizer-container']}>
                    <div id="visualizer"></div>
                </div>
            </div>
            <Footer></Footer>
        </main>
    )
  }
  