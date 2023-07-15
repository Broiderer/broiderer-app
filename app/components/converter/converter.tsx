'use client';

import { useState } from 'react';
import styles from './converter.module.scss';
import Download from './download/download';
import Form from './form/form';
import Introduction from './introduction/introduction';

export default function Converter() {

    const [fileToUpload, setFileToUpload]: [File | null, Function] = useState(null);
    const [loadingUpload, setLoadingUpload]: [boolean, Function] = useState(false);
    const [errorUploading, setErrorUploading]: [string, Function] = useState('');

    const fileInputHandler = (file: File) => {
        setFileToUpload(file);
        setLoadingUpload(true);
        setTimeout(() => {
            setLoadingUpload(false);
        }, 2000);
    }

    const backToUploadsHandler = () => {
        setFileToUpload(null);
        setErrorUploading('');
    }

    return <div className={styles.converter}>
        <div className={styles.introduction}>
            <Introduction></Introduction>
        </div>
        <div className={styles.form}>
            {loadingUpload ? <div>Loading...</div> 
                : errorUploading ? <div>Error : {errorUploading}</div>
                    : fileToUpload ? <Download onBackToUpload={backToUploadsHandler}></Download> 
                        : <Form onFileInput={fileInputHandler}></Form>
            }
        </div>
    </div>
}