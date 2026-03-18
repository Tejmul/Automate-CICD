export function Hero() {
    return (
        <section className="hero">
            <div className="hero__bg" aria-hidden="true" />

            <div className="hero__grid">
                <div className="hero__copy">
                    <div className="hero__kicker">Nike-energy • Prada-clean • Mobile-first</div>
                    <h1 className="hero__title">
                        Make your next buy feel like a product launch.
                    </h1>
                    <p className="hero__sub">
                        ShopSmart is a DummyJSON-powered ecommerce experience with a bold, modern UI and a
                        backend built like it’s headed to production.
                    </p>

                    <div className="hero__actions">
                        <button className="btn btn--primary" type="button">
                            Explore drops
                        </button>
                        <button className="btn btn--ghost" type="button">
                            View categories
                        </button>
                    </div>
                </div>

                <div className="hero__scene" aria-label="3D hero cards">
                    <div className="scene">
                        <div className="card3d card3d--a">
                            <div className="card3d__shine" />
                            <div className="card3d__content">
                                <div className="card3d__eyebrow">Featured</div>
                                <div className="card3d__headline">Monochrome essentials</div>
                                <div className="card3d__meta">Prada-inspired minimal grid</div>
                            </div>
                        </div>
                        <div className="card3d card3d--b">
                            <div className="card3d__shine" />
                            <div className="card3d__content">
                                <div className="card3d__eyebrow">New</div>
                                <div className="card3d__headline">Mobile-first checkout</div>
                                <div className="card3d__meta">Rare Beauty pacing</div>
                            </div>
                        </div>
                        <div className="card3d card3d--c">
                            <div className="card3d__shine" />
                            <div className="card3d__content">
                                <div className="card3d__eyebrow">Experimental</div>
                                <div className="card3d__headline">Try-on preview</div>
                                <div className="card3d__meta">Sephora-inspired play</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

