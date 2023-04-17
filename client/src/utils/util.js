
export const getFormatedDate = () => {
    return (new Date()).toISOString().substring(0, 10)
}

export const getFormatedDateString = () => {
    const dt = new Date();
    const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
    const dateString = `${padL(dt.getMonth() + 1)}/${padL(dt.getDate())}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`
    return dateString
}

export const getFormatedTimeFromSeconds = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let timeString = "";
    if (hours > 0) {
        timeString += `${hours} hour${hours > 1 ? "s" : ""}, `;
    }
    if (minutes > 0) {
        timeString += `${minutes} minute${minutes > 1 ? "s" : ""}, `;
    }
    timeString += `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`;

    return timeString;
}
