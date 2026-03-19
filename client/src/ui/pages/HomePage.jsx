import { Link } from 'react-router-dom'
import { Hero } from '../sections/Hero'
import { useProducts, useCartActions, useWishlist, useWishlistActions } from '../hooks/useStorefront'
import { ProductCard } from '../components/ProductCard'
import { Skeleton } from '../components/State'
import { useMemo } from 'react'

export function HomePage() {
    const { data: featuredData, isLoading: featuredLoading } = useProducts({ limit: 8 })
    const featuredProducts = featuredData?.products || []

    const cartActions = useCartActions()
    const { data: wishlistItems = [] } = useWishlist()
    const wishlistSet = useMemo(() => new Set(wishlistItems.map((x) => x.productId)), [wishlistItems])
    const wishActions = useWishlistActions()

    const handleQuickAdd = (productId) => {
        cartActions.add.mutate({ productId, quantity: 1 })
    }

    const handleWishlistToggle = (productId) => {
        if (wishlistSet.has(productId)) wishActions.remove.mutate(productId)
        else wishActions.add.mutate(productId)
    }

    return (
        <div className="page">
            <Hero />

            {/* Featured Products */}
            <section className="home-section">
                <div className="home-section__head">
                    <h2 className="home-section__title">Trending Now</h2>
                    <Link className="home-section__link" to="/shop">View All →</Link>
                </div>

                {featuredLoading ? (
                    <div className="grid">
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
                ) : (
                    <div className="grid">
                        {featuredProducts.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onQuickAdd={handleQuickAdd}
                                isWishlisted={wishlistSet.has(p.id)}
                                onWishlistToggle={handleWishlistToggle}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
