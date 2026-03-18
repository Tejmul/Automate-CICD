import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCartActions, useProduct, useWishlist, useWishlistActions } from '../hooks/useStorefront'
import { InlineError, Skeleton } from '../components/State'
import { Price } from '../components/Price'

export function ProductPage() {
    const { id } = useParams()
    const productId = useMemo(() => (id ? Number(id) : null), [id])
    const { data: product, isLoading, error } = useProduct(productId)

    const { data: wishlist = [] } = useWishlist()
    const wishlistSet = useMemo(() => new Set(wishlist.map((x) => x.productId)), [wishlist])
    const wishActions = useWishlistActions()
    const cartActions = useCartActions()

    if (error) {
        return (
            <div className="pdp">
                <InlineError title="Couldn’t load product" message={error.message} />
            </div>
        )
    }

    return (
        <div className="pdp">
            <div className="pdp__crumbs">
                <Link className="crumb" to="/shop">
                    ← Back to shop
                </Link>
            </div>

            {isLoading || !product ? (
                <div className="pdp__grid">
                    <div className="pdp__media">
                        <div className="pdp__img pdp__img--ph" />
                    </div>
                    <div className="pdp__info">
                        <Skeleton className="skel--h1" />
                        <Skeleton className="skel--line" />
                        <Skeleton className="skel--line skel--line2" />
                    </div>
                </div>
            ) : (
                <div className="pdp__grid">
                    <div className="pdp__media">
                        <img
                            className="pdp__img"
                            src={product.image}
                            alt={product.name}
                        />
                    </div>

                    <div className="pdp__info">
                        <div className="pdp__kicker">{product.category}</div>
                        <h2 className="pdp__title">{product.name}</h2>
                        <div className="pdp__meta">
                            <Price value={Number(product.priceCents) / 100} />
                            <span className="dot" aria-hidden="true">
                                ·
                            </span>
                            <span className="muted">{product.subCategory}</span>
                            {typeof product.ratingStars === 'number' ? (
                                <>
                                    <span className="dot" aria-hidden="true">
                                        ·
                                    </span>
                                    <span className="muted">
                                        {product.ratingStars.toFixed(1)} ({product.ratingCount})
                                    </span>
                                </>
                            ) : null}
                        </div>

                        <p className="pdp__desc">{product.description}</p>

                        <div className="pdp__actions">
                            <button
                                className="btn btn--primary"
                                type="button"
                                disabled={cartActions.add.isPending}
                                onClick={() => cartActions.add.mutate({ productId: product.id, quantity: 1 })}
                            >
                                {cartActions.add.isPending ? 'Adding…' : 'Add to cart'}
                            </button>

                            <button
                                className="btn btn--ghost"
                                type="button"
                                disabled={wishActions.add.isPending || wishActions.remove.isPending}
                                onClick={() => {
                                    if (wishlistSet.has(product.id)) wishActions.remove.mutate(product.id)
                                    else wishActions.add.mutate(product.id)
                                }}
                            >
                                {wishlistSet.has(product.id) ? 'Wishlisted' : 'Add to wishlist'}
                            </button>
                        </div>

                        {(cartActions.add.error || wishActions.add.error || wishActions.remove.error) && (
                            <InlineError
                                title="Action failed"
                                message={
                                    cartActions.add.error?.message ||
                                    wishActions.add.error?.message ||
                                    wishActions.remove.error?.message
                                }
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

