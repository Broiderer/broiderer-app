'use client';
import styles from './svg-editor.module.scss';

export default function SvgEditor({svgText}: {svgText: string | TrustedHTML}) {

    return <div className={styles.svgEditor}>
        Edit here 
        <div dangerouslySetInnerHTML={{__html: svgText}}></div>
    </div>
}