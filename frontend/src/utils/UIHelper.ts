export function onBlurHandler(e: React.FocusEvent<HTMLInputElement>) {
    if (e.target.value) return
    e.target.type = 'text'
}