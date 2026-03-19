import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ProductCard.css'

export function ProductCard({ product, onQuickAdd, isWishlisted, onWishlistToggle }) {
    const [adding, setAdding] = useState(false)
    const [imgLoaded, setImgLoaded] = useState(false)

    const discountPct = product?.discountPercentage
        ? Math.round(product.discountPercentage)
        : null
    const originalPrice = discountPct
        ? product.price / (1 - product.discountPercentage / 100)
        : null

    return (
        <Link to={`/product/${product.id}`} className="product-card animate-fade-up">
            <div className="product-card__img-wrap">
                {!imgLoaded && (
                    <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
                )}
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className={`product-card__img ${imgLoaded ? 'loaded' : ''}`}
                    onLoad={() => setImgLoaded(true)}
                />

                {discountPct && (
                    <div className="product-card__discount">−{discountPct}%</div>
                )}

                {onWishlistToggle && (
                    <button
                        className={`product-card__wish ${isWishlisted ? 'wished' : ''}`}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onWishlistToggle(product.id)
                        }}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>
                )}

                {onQuickAdd && (
                    <div className="product-card__overlay">
                        <button
                            className={`product-card__add ${adding ? 'adding' : ''}`}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setAdding(true)
                                onQuickAdd(product.id)
                                window.setTimeout(() => setAdding(false), 900)
                            }}
                        >
                            {adding ? (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Added
                                </>
                            ) : (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    Add to Cart
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <div className="product-card__info">
                <p className="product-card__brand label-sm">{product.brand || product.category}</p>
                <p className="product-card__name">{product.title}</p>

                <div className="product-card__meta">
                    <div className="product-card__pricing">
                        <span className="product-card__price">${product.price.toFixed(2)}</span>
                        {discountPct && originalPrice && (
                            <span className="product-card__original">${originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                    <div className="product-card__rating">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#C8A96E" stroke="none">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span>{product.rating?.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
