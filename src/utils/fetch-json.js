const fetchJson = (url, callback) => {
    fetch(url)
        .then(async response => {
            const body = await response.json()
            if (!response.ok) {
                const error = new Error(`Request failed with status ${response.status}`)
                error.body = body
                throw error
            }
            return body
        })
        .then(body => callback(undefined, {body}))
        .catch(error => callback(error, {}))
}

module.exports = fetchJson