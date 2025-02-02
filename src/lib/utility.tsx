
export const getCurURL = () => {
    if (process.env.NODE_ENV == 'production') {
        return process.env.PUBLIC_URL;
    }
    return process.env.LOCAL_URL;
}

export const getImageSrcFromPath = (str: string): string => {
    try {
        const publicStr = "/public/"
        let index = str.indexOf(publicStr)
        // -1 to keep the end slash so it's a relative path
        index += publicStr.length - 1
        return str.slice(index);
    } catch (e) {
        console.error(e)
        return ""
    }
}

export const timestampDayDifference = (ts: any, ts2: any): number => {
    let diff: number = Math.abs(ts - ts2);
    let daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return daysDiff
}

export const getDateDifferenceInStr = (ts: string, ts2: string): string => {
    let res = "";
    const d1 = new Date(ts)
    const d2 = new Date(ts2)
    const daysDiff = timestampDayDifference(d1, d2)
    let t = 0;
    if (daysDiff > 365) {
        t = daysDiff / 365
        res = `${t} Year`;
    } else if (daysDiff > 7) {
        t = daysDiff / 7
        res = `${t} Week`;
    } else {
        t = daysDiff
        res = `${t} Day`
    }
    if (Math.floor(t) > 1) {
        res += 's'
    }
    res += ' ago'
    return res;
}

