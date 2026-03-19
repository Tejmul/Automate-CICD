import { useMemo, useState } from 'react'
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

    const [selectedImg, setSelectedImg] = useState(0)

    if (error) {
        return (
            <div className="page pdp">
                <InlineError title="Couldn't load product" message={error.message} />
            </div>
        )
    }

    const images = product?.images || []
    const currentImg = images[selectedImg] || product?.thumbnail
    const hasDiscount = product?.discountPercentage > 0
    const originalPrice = hasDiscount
        ? product.price / (1 - product.discountPercentage / 100)
        : null
    const tags = product?.tags || []

    return (
        <div className="page pdp">
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
                            src={currentImg}
                            alt={product.title}
                        />
                        {images.length > 1 && (
                            <div className="pdp__thumbs">
                                {images.map((img, i) => (
                                    <img
                                        key={i}
                                        className={`pdp__thumb ${i === selectedImg ? 'pdp__thumb--active' : ''}`}
                                        src={img}
                                        alt={`${product.title} view ${i + 1}`}
                                        onClick={() => setSelectedImg(i)}
                                        loading="lazy"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pdp__info">
                        <div className="pdp__kicker">{product.category}</div>
                        <h2 className="pdp__title">{product.title}</h2>

                        <div className="pdp__meta">
                            {product.brand && (
                                <>
                                    <span className="pdp__brand">{product.brand}</span>
                                    <span className="dot" aria-hidden="true">·</span>
                                </>
                            )}
                            {typeof product.rating === 'number' && product.rating > 0 && (
                                <>
                                    <span className="pdp__rating">
                                        ★ {product.rating.toFixed(1)}
                                    </span>
                                    <span className="dot" aria-hidden="true">·</span>
                                </>
                            )}
                            <span className={`pdp__stock ${product.stock > 0 ? 'pdp__stock--in' : 'pdp__stock--out'}`}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                        </div>

                        <div className="pdp__price-block">
                            <Price
                                value={product.price}
                                originalValue={originalPrice}
                                discountPercentage={product.discountPercentage}
                                large
                            />
                            {hasDiscount && (
                                <span className="pdp__discount-badge">
                                    Save {Math.round(product.discountPercentage)}%
                                </span>
                            )}
                        </div>

                        <p className="pdp__desc">{product.description}</p>

                        {tags.length > 0 && (
                            <div className="pdp__tags">
                                {tags.map((tag) => (
                                    <span key={tag} className="pdp__tag">#{tag}</span>
                                ))}
                            </div>
                        )}

                        <div className="pdp__actions">
                            <button
                                className="btn btn--primary"
                                type="button"
                                disabled={cartActions.add.isPending || product.stock === 0}
                                onClick={() => cartActions.add.mutate({ productId: product.id, quantity: 1 })}
                            >
                                {cartActions.add.isPending ? 'Adding…' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
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
                                {wishlistSet.has(product.id) ? '♥ Wishlisted' : '♡ Add to Wishlist'}
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
