export function formatMoney(value, { currency = 'USD' } = {}) {
    const number = Number(value)
    const safe = Number.isFinite(number) ? number : 0
    try {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency,
            maximumFractionDigits: 0,
        }).format(safe)
    } catch {
        return `$${safe.toFixed(0)}`
    }
}

export function Price({ value, currency }) {
    return <span className="price">{formatMoney(value, { currency })}</span>
}

