import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useWishlistWithProducts, useWishlistActions, useCartActions } from '../hooks/useStorefront'
import { EmptyState, InlineError, Skeleton } from '../components/State'
import { Price } from '../components/Price'

export function WishlistPage() {
    const { products, productIds, isLoading, error } = useWishlistWithProducts()
    const wishActions = useWishlistActions()
    const cartActions = useCartActions()

    return (
        <div className="page">
            <div className="wishlist__top">
                <div>
                    <div className="pagekicker">Wishlist</div>
                    <h2 className="pagetitle">Your Saved Items</h2>
                    <p className="pagesub">
                        {productIds.size > 0
                            ? `${productIds.size} saved item${productIds.size > 1 ? 's' : ''}`
                            : 'Nothing saved yet'}
                    </p>
                </div>
            </div>

            {error ? (
                <InlineError title="Couldn't load wishlist" message={error.message} />
            ) : isLoading ? (
                <div className="grid" style={{ marginTop: 18 }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="pcard pcard--skel">
                            <div className="pcard__media">
                                <div className="pcard__img pcard__img--ph" />
                            </div>
                            <div className="pcard__body">
                                <Skeleton className="skel--line" />
                                <Skeleton className="skel--line skel--line2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <EmptyState
                    icon="♡"
                    title="No saved items"
                    message="Heart products while browsing to save them here."
                    action={
                        <Link className="btn btn--primary" to="/shop">
                            Browse Products
                        </Link>
                    }
                />
            ) : (
                <div className="grid" style={{ marginTop: 18 }}>
                    {products.map((p) => (
                        <div key={p.id} className="pcard wishcard">
                            <button
                                className="wishcard__x"
                                onClick={() => wishActions.remove.mutate(p.id)}
                                aria-label="Remove from wishlist"
                            >
                                ✕
                            </button>

                            <Link to={`/product/${p.id}`}>
                                <div className="pcard__media">
                                    {p.thumbnail ? (
                                        <img className="pcard__img" src={p.thumbnail} alt={p.title} loading="lazy" />
                                    ) : (
                                        <div className="pcard__img pcard__img--ph" aria-hidden="true" />
                                    )}

                                    <div className="pcard__overlay">
                                        <div className="pcard__quick-actions">
                                            <button
                                                className="pcard__quick-btn"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    cartActions.add.mutate({ productId: p.id, quantity: 1 })
                                                }}
                                            >
                                                Move to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link to={`/product/${p.id}`} className="pcard__body">
                                {p.brand && <div className="pcard__brand">{p.brand}</div>}
                                <div className="pcard__title">{p.title}</div>
                                <div className="pcard__meta">
                                    <Price value={p.price} />
                                    {typeof p.rating === 'number' && p.rating > 0 && (
                                        <>
                                            <span className="dot" aria-hidden="true">·</span>
                                            <span className="pcard__rating">★ {p.rating.toFixed(1)}</span>
                                        </>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
