import styles from './introduction.module.scss';

export default function Introduction() {
    return <div className={styles.intro}>
        <h1 className="bro-title">Embroidery Files Converter</h1>
        <p><span className='bro-emphasis'>Convert your embroidery designs between SVG and PES formats for free</span> using our online file converter. This tool is currently in beta and under development. We will be adding support for additional embroidery formats in the future. Stay tuned for updates! <span className='bro-emphasis'>Start converting your SVG and PES files now.</span></p>
    </div>
}