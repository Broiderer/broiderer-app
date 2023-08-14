"use client"
import SvgEditor from "@/app/components/svg-editor/svg-editor";
import SvgUploadZone from "@/app/components/svg-upload-zone/svg-upload-zone";
import React, { useState } from "react";

const Upload = () => {
    const [uploadedSvgText, setUploadedSvgText] = useState<string | null>(null);

    const uploadedSvgHandler = (svgText: string) => {
        setUploadedSvgText(svgText)
    }

    return <>
        {uploadedSvgText && <SvgEditor svgText={uploadedSvgText || ''} />}
        {!uploadedSvgText && <SvgUploadZone onUploadSvg={uploadedSvgHandler}/>}
    </>;
};

export default Upload;