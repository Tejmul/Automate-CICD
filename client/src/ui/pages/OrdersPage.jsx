import { Link } from 'react-router-dom'
import { useOrders } from '../hooks/useStorefront'
import { EmptyState, InlineError, Skeleton } from '../components/State'
import { formatMoney } from '../components/Price'

function orderTotal(order) {
    const items = order?.items || []
    return items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0)
}

export function OrdersPage() {
    const { data: orders = [], isLoading, error } = useOrders()

    if (error) return <InlineError title="Couldn’t load orders" message={error.message} />

    return (
        <div className="orders">
            <div className="orders__top">
                <div className="pagekicker">Orders</div>
                <h2 className="pagetitle">Receipts, status, and clean history.</h2>
                <p className="pagesub">Place an order from your cart to see it here.</p>
            </div>

            {isLoading ? (
                <div className="panel">
                    <Skeleton className="skel--line" />
                    <Skeleton className="skel--line skel--line2" />
                    <Skeleton className="skel--line" />
                </div>
            ) : orders.length === 0 ? (
                <EmptyState
                    title="No orders yet"
                    message="Checkout turns your cart into an order."
                    action={
                        <Link className="btn btn--primary" to="/shop">
                            Shop drops
                        </Link>
                    }
                />
            ) : (
                <div className="orders__list">
                    {orders.map((o) => (
                        <div key={o.id} className="order">
                            <div className="order__head">
                                <div className="order__id">Order {o.id.slice(0, 8)}</div>
                                <div className="order__status">{o.status}</div>
                            </div>
                            <div className="order__meta">
                                <span className="muted">{new Date(o.createdAt).toLocaleString()}</span>
                                <span className="dot" aria-hidden="true">
                                    ·
                                </span>
                                <span>{formatMoney(orderTotal(o), { currency: o.currency || 'USD' })}</span>
                                <span className="dot" aria-hidden="true">
                                    ·
                                </span>
                                <span className="muted">{(o.items || []).length} items</span>
                            </div>
                            <div className="order__items">
                                {(o.items || []).slice(0, 3).map((it) => (
                                    <div key={it.id} className="orderitem">
                                        <div className="orderitem__title">{it.title}</div>
                                        <div className="orderitem__qty">×{it.quantity}</div>
                                    </div>
                                ))}
                                {(o.items || []).length > 3 ? (
                                    <div className="muted">+ {(o.items || []).length - 3} more</div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

