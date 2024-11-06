"use client"
import React from "react";

function DropZone({ name, acceptedFileTypes, fileCallback, multiple }:
    {
        name?: string,
        acceptedFileTypes: string, fileCallback(files: File[]): void, multiple?: boolean
    }) {

    // onDragEnter sets inDropZone to true
    const handleDragEnter = (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        e.dataTransfer.dropEffect = "copy";
    };

    // onDragOver sets inDropZone to true
    const handleDragOver = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
    };

    // onDragLeave sets inDropZone to false
    const handleDragLeave = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
    };


    // onDrop sets inDropZone to false and adds files to fileList
    const handleDrop = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        let isDropzoneFile: string = e.dataTransfer.getData("isDropzoneFile")
        if (isDropzoneFile.includes("false")) {
            return
        }

        // get files from event on the dataTransfer object as an array
        let files = [...e.dataTransfer.files];
        // ensure a file or files are dropped
        if (files && files.length > 0) {
            fileCallback(files);
        }
    };

    // handle file selection via input element
    const handleFileSelect = async (e: any) => {
        // get files from event on the input element as an array
        let files = [...e.target.files];
        // ensure a file or files are dropped
        if (files && files.length > 0) {
            fileCallback(files);
        }
    };

    return (
        <>
            <div
                className='dropzone flex flex-col justify-center items-center border-dashed border-2 border-[#ccc] h-full w-full'
                onDrop={(e) => handleDrop(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDragEnter={(e) => handleDragEnter(e)}
                onDragLeave={(e) => handleDragLeave(e)}
            >
                <input
                    id={`fileSelect${name}`}
                    type="file"
                    accept={acceptedFileTypes}
                    className='files border-0 clip-[rect(0,0,0,0)] h-[1px] overflow-hidden p-0 absolute whitespace-nowrap w-[1px] hidden'
                    onChange={(e) => handleFileSelect(e)}
                    multiple={multiple}
                />
                <label htmlFor={`fileSelect${name}`} className="mt-[1rem] bg-blue-800 rounded !text-inherit cursor-pointer inline-block px-1 py-3 text-center select-none
                    hover:text-[#fff] focus:text-[#fff] focus:outlline-dotted focus:outline-[5px] focus:outline-white">Select {name}</label>

                <h3 className='uploadMessage my-[1em] text-white'>
                    or drag &amp; drop your {name} here
                </h3>
            </div>
        </>
    );
};

export default DropZone;
