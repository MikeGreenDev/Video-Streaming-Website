export const getCurURL = () => {
    if (process.env.NODE_ENV == 'production'){
        return process.env.PUBLIC_URL;
    }
    return process.env.LOCAL_URL;
}
