module.exports = {
    prettyDateTime: (dt) => {
        const day = dt.getDate() < 10 ? `0${dt.getDate()}` : `${dt.getDate()}`
        const month = dt.getMonth() + 1 < 10 ? `0${dt.getMonth() + 1}` : `${dt.getMonth() + 1}`
        const year = dt.getFullYear()
        const hours = dt.getHours() < 10 ? `0${dt.getHours()}` : `${dt.getHours()}`
        const minutes = dt.getMinutes() < 10 ? `0${dt.getMinutes()}` : `${dt.getMinutes()}`
    
        return `${day}-${month}-${year} ${hours}:${minutes}`
    },
    previewString: (str) => {
        const previewLength = 80
    
        if(str.length > previewLength) {
            return `${str.substring(0, previewLength)}...`
        } else {
            return str.substring(0, previewLength)
        }
    },
    escapeHtml : (html) => {
        return html
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\n/g, "<br>")
    }
}