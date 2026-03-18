import { Link } from 'react-router-dom'
import { useWishlistActions, useWishlistWithProducts } from '../hooks/useStorefront'
import { EmptyState, InlineError, Skeleton } from '../components/State'
import { ProductCard } from '../components/ProductCard'

export function WishlistPage() {
    const { products, productIds, isLoading, error } = useWishlistWithProducts()
    const actions = useWishlistActions()

    if (error) return <InlineError title="Couldn’t load wishlist" message={error.message} />

    return (
        <div className="wishlist">
            <div className="wishlist__top">
                <div className="pagekicker">Wishlist</div>
                <h2 className="pagetitle">Save it now. Decide later.</h2>
                <p className="pagesub">Fast, simple, and synced to the backend.</p>
            </div>

            {isLoading ? (
                <div className="grid">
                    {Array.from({ length: 8 }).map((_, i) => (
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
                    title="No wishlist items"
                    message="Tap ‘Add to wishlist’ on any product."
                    action={
                        <Link className="btn btn--primary" to="/shop">
                            Browse products
                        </Link>
                    }
                />
            ) : (
                <>
                    <div className="chips chips--muted">
                        <span className="muted">{products.length} items</span>
                        <span className="muted">·</span>
                        <button
                            className="linkbtn"
                            type="button"
                            disabled={actions.remove.isPending}
                            onClick={() => {
                                for (const id of productIds) actions.remove.mutate(id)
                            }}
                        >
                            Remove all
                        </button>
                    </div>
                    <div className="grid">
                        {products.map((p) => (
                            <div key={p.id} className="wishcard">
                                <ProductCard product={p} />
                                <button
                                    className="wishcard__x"
                                    type="button"
                                    onClick={() => actions.remove.mutate(p.id)}
                                    aria-label="Remove from wishlist"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

