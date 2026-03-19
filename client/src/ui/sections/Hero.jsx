import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useStorefront'

export function Hero() {
    const { data } = useProducts({ limit: 6 })
    const featured = data?.products?.slice(0, 3) || []

    return (
        <section className="hero">
            <div className="hero__bg">
                <div className="hero__grid" />
                <div className="hero__orb hero__orb--1" />
                <div className="hero__orb hero__orb--2" />
            </div>

            <div className="container hero__inner">
                <div className="hero__content">
                    <div className="badge-gold animate-fade-up" style={{ marginBottom: 32 }}>
                        <span style={{ marginRight: 6 }}>✦</span> Premium Collection · 2025
                    </div>

                    <h1 className="display-xl hero__headline animate-fade-up animate-fade-up-delay-1">
                        Shop<br />
                        <em style={{ fontStyle: 'italic', color: 'var(--ivory-dim)' }}>smarter.</em>
                    </h1>

                    <p className="hero__sub animate-fade-up animate-fade-up-delay-2">
                        Curated goods with lightning search,<br />
                        real-time inventory, seamless checkout.
                    </p>

                    <div className="hero__actions animate-fade-up animate-fade-up-delay-3">
                        <Link to="/shop" className="btn-primary">
                            Explore Collection
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link to="/wishlist" className="btn-outline">Saved Items</Link>
                    </div>

                    <div className="hero__stats animate-fade-up animate-fade-up-delay-4">
                        {[['194', 'Products'], ['22', 'Categories'], ['4.8★', 'Avg Rating']].map(([n, l]) => (
                            <div key={l} className="hero__stat">
                                <span className="hero__stat-n">{n}</span>
                                <span className="hero__stat-l">{l}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hero__visual animate-fade-up animate-fade-up-delay-2">
                    {featured.slice(0, 3).map((p, i) => (
                        <Link key={p.id} to={`/product/${p.id}`} className={`hero__card hero__card--${i}`}>
                            <div className="hero__card-img">
                                <img src={p.thumbnail} alt={p.title} />
                            </div>
                            <div className="hero__card-info">
                                <span className="hero__card-name">{p.title}</span>
                                <span className="hero__card-price">${p.price.toFixed(2)}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="hero__scroll-hint">
                <div className="hero__scroll-line" />
                <span>Scroll</span>
            </div>
        </section>
    )
}
