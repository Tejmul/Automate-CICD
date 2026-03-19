import { Link } from 'react-router-dom'
import { useOrders } from '../hooks/useStorefront'
import { EmptyState, InlineError, Skeleton } from '../components/State'
import { Price } from '../components/Price'

export function OrdersPage() {
    const { data: orders = [], isLoading, error } = useOrders()

    const formatDate = (d) => {
        try {
            return new Date(d).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
        } catch {
            return d
        }
    }

    const orderTotal = (items) =>
        items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div className="page">
            <div className="orders__top">
                <div>
                    <div className="pagekicker">Orders</div>
                    <h2 className="pagetitle">Order History</h2>
                    <p className="pagesub">
                        {orders.length > 0
                            ? `${orders.length} order${orders.length > 1 ? 's' : ''}`
                            : 'No orders yet'}
                    </p>
                </div>
            </div>

            {error ? (
                <InlineError title="Couldn't load orders" message={error.message} />
            ) : isLoading ? (
                <div className="orders__list">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="order">
                            <Skeleton className="skel--line" />
                            <Skeleton className="skel--line skel--line2" />
                        </div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <EmptyState
                    icon="📦"
                    title="No orders yet"
                    message="Once you checkout, your orders will appear here."
                    action={
                        <Link className="btn btn--primary" to="/shop">
                            Start Shopping
                        </Link>
                    }
                />
            ) : (
                <div className="orders__list">
                    {orders.map((order) => (
                        <div key={order.id} className="order">
                            <div className="order__head">
                                <span className="order__id">#{order.id.slice(0, 8)}</span>
                                <span className={`order__status order__status--${order.status}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order__meta">
                                <span className="muted">{formatDate(order.createdAt)}</span>
                                <span className="dot" aria-hidden="true">·</span>
                                <span>{order.items?.length || 0} items</span>
                                <span className="dot" aria-hidden="true">·</span>
                                <Price value={orderTotal(order.items || [])} />
                            </div>
                            {order.items?.length > 0 && (
                                <div className="order__items">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="orderitem">
                                            <span>
                                                {item.title}
                                                {item.quantity > 1 && (
                                                    <span className="muted"> × {item.quantity}</span>
                                                )}
                                            </span>
                                            <Price value={item.price * item.quantity} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
