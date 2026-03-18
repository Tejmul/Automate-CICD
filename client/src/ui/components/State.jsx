export function InlineError({ title = 'Something went wrong', message }) {
    return (
        <div className="state state--error" role="alert">
            <div className="state__title">{title}</div>
            {message ? <div className="state__msg">{message}</div> : null}
        </div>
    )
}

export function EmptyState({ title = 'Nothing here yet', message, action }) {
    return (
        <div className="state state--empty">
            <div className="state__title">{title}</div>
            {message ? <div className="state__msg">{message}</div> : null}
            {action ? <div className="state__action">{action}</div> : null}
        </div>
    )
}

export function Skeleton({ className }) {
    return <div className={className ? `skel ${className}` : 'skel'} aria-hidden="true" />
}

