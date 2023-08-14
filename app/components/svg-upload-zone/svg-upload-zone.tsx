'use client';

import { useState } from 'react';
import Form from '../converter/form/form';
import styles from './svg-upload-zone.module.scss';

export default function SvgUploadZone() {
    const [fileToUpload, setFileToUpload]: [File | null, Function] = useState(null);

    const fileInputHandler = async (file: File) => {
        var doc = new DOMParser();
        const targetDiv = document.getElementById('visualizer');
        if (!targetDiv) {
            return;
        }
        targetDiv.innerHTML = await file.text();
        setFileToUpload(file);
    }

    return <div className={styles.svgUploadZone}>
        <div className={styles.form}>
            <Form onFileInput={fileInputHandler} from="svg" to="svg" placeholder="Upload a .svg file"></Form>
        </div>
    </div>
}