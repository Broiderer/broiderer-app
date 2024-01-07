import Footer from '../components/footer/footer'
import Header from '../components/header/header'
import styles from './styles.module.scss'

export default function About() {
  return (
    <div className={styles['about']}>
      <Header></Header>
      <main className={styles['about-content']}>
        <h1 className="bro-title">About</h1>

        <p>
          I've owned an embroidery machine for a decade now, and achieving a
          clean embroidery result in my sewing projects has always been a
          challenge. Understanding how to get the best result with the right
          fabric, thread, backing, and machine settings can be daunting,
          especially for an amateur embroiderer.
        </p>
        <p>
          Even after mastering these aspects, creating a clean vector design for
          importing into the machine remains a hurdle when you have a custom
          idea in mind.
        </p>
        <p>
          To simplify this process, I created Broiderer. Many embroidery file
          editing and creation software are outdated and not Mac-friendly.
          Broiderer, on the other hand, is accessible directly in the browser
          without requiring installation. The goal is for it to act as a bridge
          between highly specialized (and often expensive) softwares, and the
          basic editing options within the machine.
        </p>
        <p>
          For now the version 1.0 of Broiderer is completely free to use without
          a subscription, but the features are limited. As the software is in
          its early stages, I welcome any recommendations for additional
          features or bug reports.
        </p>
        <p>
          Feel free to contact me at{' '}
          <a
            href="mailto:guillaume.meigniez@gmail.com?subject=[BROIDERER]"
            className="bro-link"
          >
            guillaume.meigniez@gmail.com
          </a>
          .
        </p>
      </main>
      <Footer></Footer>
    </div>
  )
}
