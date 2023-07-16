import Card from '../components/card/card';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';
import styles from './styles.module.scss';

export default function Home() {
    return (
      <main className={styles.home}>
        <Header></Header>
        <div className={styles.content}>
          <div className={styles.introduction}>
          <h1 className="bro-title">Embroidery Files Converter</h1>
            <p><span className='bro-emphasis'>Convert your embroidery designs for free</span> from <a className="bro-link" href="https://edutechwiki.unige.ch/en/Embroidery_format_PES" target="_blank">PES</a> to <a className="bro-link" href="https://developer.mozilla.org/en-US/docs/Web/SVG" target="_blank">SVG</a> or from SVG to PES. This tool is currently in beta and under development. We will be adding support for additional embroidery formats in the future. Stay tuned for updates! <span className='bro-emphasis'>Start converting your SVG and PES files now.</span></p>
          </div>

          <div className={styles.links}>
            <Card title="PES to SVG" href="/convert/pes2svg">
              This dedicated tool allows you to easily <span className="bro-emphasis">convert your PES embroidery files to SVG format</span>. The attributes and dimension of your .pes file will be kept as much as possible. Start converting your PES files to SVG now.
            </Card>

            <Card title="SVG to PES" href="/convert/svg2pes">
              This dedicated tool allows you to easily <span className="bro-emphasis">convert your SVG files to PES format</span>. You can select the options for the fill of the outputted SVG. Start converting your SVG files to PES now.
            </Card>
          </div>
        </div>
        <Footer></Footer>
      </main>
    )
  }
  