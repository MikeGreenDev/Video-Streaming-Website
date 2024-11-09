import path from "path";

export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_PATH ?? "", "public/uploads/")

export const getCurURL = () => {
    if (process.env.NODE_ENV == 'production'){
        return process.env.PUBLIC_URL;
    }
    return process.env.LOCAL_URL;
}

export const getImageSrcFromPath = (str: string): string => {
    const publicStr = "/public/"
    let index = str.indexOf(publicStr)
    // -1 to keep the end slash so it's a relative path
    index += publicStr.length - 1
    return str.slice(index);
}
