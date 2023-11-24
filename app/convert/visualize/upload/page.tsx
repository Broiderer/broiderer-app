"use client"
import SvgEditor from "@/app/components/svg-editor/svg-editor";
import SvgUploadZone from "@/app/components/svg-upload-zone/svg-upload-zone";
import React, { useState } from "react";

const Upload = () => {
    const [uploadedSvg, setUploadedSvg] = useState<File | null>(null);

    const uploadedSvgHandler = (svg: File) => {
        setUploadedSvg(svg)
    }

    return <>
        {uploadedSvg && <SvgEditor svg={uploadedSvg} />}
        {!uploadedSvg && <SvgUploadZone onUploadSvg={uploadedSvgHandler}/>}
    </>;
};

export default Upload;