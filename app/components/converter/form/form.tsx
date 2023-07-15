'use client';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './form.module.scss';

export default function Form(props: {onFileInput: Function}) {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        props.onFileInput(acceptedFiles[0])
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {
        'image/svg+xml': ['.svg'], 'accpliaction/pes': ['.pes']
    } });

    return <form className={styles.form}>
        <div className={styles['upload-target']} {...getRootProps()}>
            <label>Drop a .pes or .svg file here to be converted (max 100kB)</label>
            <input type="file" {...getInputProps()}></input>
        </div>
    </form>
}