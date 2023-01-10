
export const getFormatedDate = () => {
    return (new Date()).toISOString().substring(0, 10)
}

export const getFormatedDateString = () => {
    const dt = new Date();
    const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
    const dateString = `${padL(dt.getMonth() + 1)}/${padL(dt.getDate())}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`
    return dateString
}
