export function Hero() {
    return (
        <section className="hero">
            <div className="hero__grid">
                <div className="hero__copy">
                    <div className="hero__kicker">Clean. Minimal. Ecommerce-first.</div>
                    <h1 className="hero__title">Shop smarter.</h1>
                    <p className="hero__sub">
                        Products are synced into our own database, then served from the backend for fast, consistent
                        browsing.
                    </p>

                    <div className="hero__actions">
                        <a className="btn btn--primary" href="/shop">
                            Shop products
                        </a>
                        <a className="btn btn--ghost" href="/cart">
                            View cart
                        </a>
                    </div>
                </div>

                <div className="hero__media" aria-hidden="true">
                    <div className="hero__frame" />
                </div>
            </div>
        </section>
    )
}

