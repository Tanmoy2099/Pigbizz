export function shortDate(dt: Date | string) {
    return (new Date(dt)).toLocaleDateString('en-UK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

export function editDateTimeFormat(dt: Date | string) {
    const val = String(dt).split('.')[0]

    // return new Date(val).toISOString()
    return val
}

export function editDateFormat(dt: Date | string) {
    const val = String(dt).split('T')[0]

    // return new Date(val).toISOString()
    return val
}