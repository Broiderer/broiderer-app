import Footer from "@/app/components/footer/footer"
import Header from "@/app/components/header/header"
import styles from './styles.module.scss';

export default function VisualizeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>
        <main className={styles.visualize}>
            <Header></Header>
            <div className={styles.content}>
                <h1 className="bro-title">Visualize your svg files</h1>
                <div className={styles['visualize-container']}>
                    {children}
                </div>
            </div>
            <Footer></Footer>
        </main>
    </>
}