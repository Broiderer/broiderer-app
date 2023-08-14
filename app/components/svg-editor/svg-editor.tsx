'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './svg-editor.module.scss';

export default function SvgEditor({ svg }: { svg: File }) {
    const [svgData, setSvgData] = useState<string>('');

    const svgRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const reader = new FileReader();
        reader.onload = async () => {
            setSvgData(await svg.text());
        };

        reader.readAsDataURL(svg);
    }, [svg])

    const clickButtonHandler = () => {
        Array.from(svgRef.current?.getElementsByTagName('circle') || []).forEach(el => {
            el.setAttribute('fill', 'red')
        })
    }

    return <div className={styles.svgEditor}>
        <button type="button" onClick={clickButtonHandler}>Make it red</button>
        {svgData && <div ref={svgRef} id="svg-sandbox" dangerouslySetInnerHTML={{__html: svgData}}></div>}

    </div>
}