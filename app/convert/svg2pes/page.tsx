import Converter from "@/app/components/converter/converter";
import Footer from "@/app/components/footer/footer";
import Header from "@/app/components/header/header";
import styles from './styles.module.scss';

export default function SvgToPes() {
    return (
        <main className={styles.svg2pes}>
            <Header></Header>
            <div className={styles.content}>
                <h1 className="bro-title">Convert SVG to PES</h1>
                <p>This dedicated tool allows you to easily <span className="bro-emphasis">convert your SVG files to PES format</span>. You can select the options for the fill of the outputted SVG. Please keep in mind that this tool is currently in development, and unexpected results may occur. However, we encourage you to give it a try and start converting your SVG files to PES now.</p>
                <Converter from="svg" to="pes"></Converter>
            </div>
            <Footer></Footer>
        </main>
    )
  }
  