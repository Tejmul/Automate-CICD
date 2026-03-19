export function Skeleton({ className = '' }) {
    return <div className={`skel ${className}`} />
}

export function InlineError({ title, message, onRetry }) {
    return (
        <div className="state state--error">
            <div className="state__title">{title}</div>
            {message && <p className="state__msg">{message}</p>}
            {onRetry && (
                <div className="state__action">
                    <button className="btn btn--ghost" type="button" onClick={onRetry}>
                        Try Again
                    </button>
                </div>
            )}
        </div>
    )
}

export function EmptyState({ title, message, action, icon }) {
    return (
        <div className="state">
            {icon && <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.4 }}>{icon}</div>}
            <div className="state__title">{title}</div>
            {message && <p className="state__msg">{message}</p>}
            {action && <div className="state__action">{action}</div>}
        </div>
    )
}
