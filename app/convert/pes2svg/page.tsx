import Converter from "@/app/components/converter/converter";
import Footer from "@/app/components/footer/footer";
import Header from "@/app/components/header/header";
import styles from './styles.module.scss';

export default function Pes2Svg() {
    return (
        <main className={styles.pes2svg}>
            <Header></Header>
            <div className={styles.content}>
                <h1 className="bro-title">Convert PES to SVG</h1>
                <p>This dedicated tool allows you to easily <span className="bro-emphasis">convert your PES embroidery files to SVG format</span>. The attributes and dimension of your .pes file will be kept as much as possible. Please keep in mind that this tool is currently in development, and unexpected results may occur. However, we encourage you to give it a try and start converting your PES files to SVG now.</p>
                <Converter from="pes" to="svg"></Converter>
            </div>
            <Footer></Footer>
        </main>
    )
  }
  