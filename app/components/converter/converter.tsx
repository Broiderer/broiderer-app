'use client';

import { useState } from 'react';
import styles from './converter.module.scss';
import Download from './download/download';
import ErrorMessage from './error/error';
import Form from './form/form';
import Introduction from './introduction/introduction';

async function uploadFile(file: File) {
    /* const apiUrl = 'http://127.0.0.1:5000'; */
    const apiUrl = 'https://guillaumemmm.pythonanywhere.com';

    const extensionFrom = file.name.split('.').pop();
    const extensionTo = extensionFrom === 'pes' ? 'svg' : 'pes';

    const formData = new FormData();
    formData.append('file', file);

    return fetch(
        `${apiUrl}/convert?extensionFrom=${extensionFrom}&extensionTo=${extensionTo}`, 
        {
            method: 'POST',
            body: formData
        }
    );
}

function parseErrorFromResponseText(responseText: string): string {
    const errorMessageMatch = responseText.match(/<p>(.*?)<\/p>/);
    if (errorMessageMatch && errorMessageMatch.length > 1) {
      return errorMessageMatch[1];
    }
    return 'Unknown error';
  }

export default function Converter() {

    const [fileToUpload, setFileToUpload]: [File | null, Function] = useState(null);
    const [uploadedFileUrl, setUploadedFileUrl]: [string, Function] = useState('');
    const [loadingUpload, setLoadingUpload]: [boolean, Function] = useState(false);
    const [errorUploading, setErrorUploading]: [string, Function] = useState('');

    const fileInputHandler = async (file: File) => {
        setFileToUpload(file);
        setLoadingUpload(true);
        setUploadedFileUrl('');
        
        try {
            const response = await uploadFile(file);
            const responseText = await response.text();
            if (!response.ok) {
                throw new Error(parseErrorFromResponseText(responseText));
            }
            const fileDownloadUrl = responseText;
            setUploadedFileUrl(fileDownloadUrl);
        } catch (error: unknown) {
            setErrorUploading((error as {message: string})?.message)
        } finally {
            setLoadingUpload(false);
        }
    }

    const backToUploadsHandler = () => {
        setFileToUpload(null);
        setErrorUploading('');
        setUploadedFileUrl('');
    }

    return <div className={styles.converter}>
        <div className={styles.introduction}>
            <Introduction></Introduction>
        </div>
        <div className={styles.form}>
            {loadingUpload ? <div>Loading...</div> 
                : errorUploading ? <ErrorMessage message={errorUploading} onBackToUpload={backToUploadsHandler}></ErrorMessage>
                    : fileToUpload ? <Download onBackToUpload={backToUploadsHandler} downloadFileUrl={uploadedFileUrl}></Download> 
                        : <Form onFileInput={fileInputHandler}></Form>
            }
        </div>
    </div>
}