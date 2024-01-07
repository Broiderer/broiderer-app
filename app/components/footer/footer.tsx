import styles from './footer.module.scss'
const { version } = require('../../../package.json')

export default function Footer() {
  return (
    <footer className={styles['footer']}>
      <a href="https://www.guillaumemeigniez.me" className="bro-link">
        Made by Guillaume MMM
      </a>
      <div>
        <span className="bro-muted">{version}</span>
      </div>
    </footer>
  )
}
