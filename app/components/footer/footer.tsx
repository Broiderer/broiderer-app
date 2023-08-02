import styles from './footer.module.scss';
const { version } = require('../../../package.json');

export default function Footer() {

    return <div className={styles.footer}>
        <a className="bro-link" target="_blank" href="http://www.guillaumemeigniez.me">Guillaume MMM</a>

        <div><span className="bro-muted">{version}</span></div>
    </div>
}