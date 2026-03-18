import { Link } from 'react-router-dom'
import { useCartActions, useCartWithProducts, useCheckout } from '../hooks/useStorefront'
import { EmptyState, InlineError, Skeleton } from '../components/State'
import { Price, formatMoney } from '../components/Price'

function CartRow({ line }) {
    const product = line.product
    const actions = useCartActions()

    return (
        <div className="cartrow">
            <div className="cartrow__media">
                {!product ? (
                    <div className="cartrow__img cartrow__img--ph" />
                ) : (
                    <img className="cartrow__img" src={product.image} alt={product.name} loading="lazy" />
                )}
            </div>
            <div className="cartrow__body">
                <div className="cartrow__title">{product?.name || `Product #${line.productId}`}</div>
                <div className="cartrow__meta">
                    {product ? <Price value={Number(product.priceCents) / 100} /> : <Skeleton className="skel--price" />}
                    <span className="dot" aria-hidden="true">
                        ·
                    </span>
                    <span className="muted">Qty</span>
                    <div className="qty">
                        <button
                            className="qty__btn"
                            type="button"
                            onClick={() =>
                                actions.setQuantity.mutate({
                                    productId: line.productId,
                                    quantity: Math.max(1, line.quantity - 1),
                                })
                            }
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <div className="qty__val">{line.quantity}</div>
                        <button
                            className="qty__btn"
                            type="button"
                            onClick={() =>
                                actions.setQuantity.mutate({
                                    productId: line.productId,
                                    quantity: Math.min(99, line.quantity + 1),
                                })
                            }
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                    <button
                        className="linkbtn"
                        type="button"
                        onClick={() => actions.remove.mutate(line.productId)}
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    )
}

export function CartPage() {
    const { lines, subtotal, isLoading, error } = useCartWithProducts()
    const checkout = useCheckout()
    const actions = useCartActions()

    if (error) return <InlineError title="Couldn’t load cart" message={error.message} />

    return (
        <div className="cart">
            <div className="cart__top">
                <div className="pagekicker">Cart</div>
                <h2 className="pagetitle">Mobile-first checkout, zero fluff.</h2>
                <p className="pagesub">Your cart items are stored in the backend (SQLite + Prisma).</p>
            </div>

            {isLoading ? (
                <div className="panel">
                    <Skeleton className="skel--line" />
                    <Skeleton className="skel--line skel--line2" />
                </div>
            ) : lines.length === 0 ? (
                <EmptyState
                    title="Your cart is empty"
                    message="Go pick something that feels like a drop."
                    action={
                        <Link className="btn btn--primary" to="/shop">
                            Shop now
                        </Link>
                    }
                />
            ) : (
                <div className="cart__grid">
                    <div className="panel">
                        <div className="panel__head">
                            <div className="panel__title">Items</div>
                            <button
                                className="linkbtn"
                                type="button"
                                disabled={actions.clear.isPending}
                                onClick={() => actions.clear.mutate()}
                            >
                                Clear
                            </button>
                        </div>
                        <div className="cart__list">
                            {lines.map((line) => (
                                <CartRow key={line.productId} line={line} />
                            ))}
                        </div>
                    </div>

                    <div className="panel panel--sticky">
                        <div className="panel__title">Summary</div>
                        <div className="summary">
                            <div className="summary__row">
                                <span className="muted">Subtotal</span>
                                <span>{formatMoney(subtotal)}</span>
                            </div>
                            <div className="summary__row">
                                <span className="muted">Shipping</span>
                                <span className="muted">Calculated at checkout</span>
                            </div>
                            <div className="summary__row summary__row--total">
                                <span>Total</span>
                                <span>{formatMoney(subtotal)}</span>
                            </div>
                        </div>
                        <button
                            className="btn btn--primary"
                            type="button"
                            disabled={checkout.isPending}
                            onClick={() => checkout.mutate()}
                        >
                            {checkout.isPending ? 'Placing order…' : 'Checkout'}
                        </button>
                        {checkout.error ? (
                            <InlineError title="Checkout failed" message={checkout.error.message} />
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    )
}

