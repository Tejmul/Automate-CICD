import { Link } from 'react-router-dom'
import { Hero } from '../sections/Hero'

export function HomePage() {
    return (
        <div className="page">
            <Hero />
            <div className="homecta">
                <div className="panel homecta__panel">
                    <div className="panel__title">Start shopping</div>
                    <div className="muted">
                        Browse the catalog, open a product page, add it to cart, and checkout to create an order.
                    </div>
                    <div className="homecta__actions">
                        <Link className="btn btn--primary" to="/shop">
                            Open Shop
                        </Link>
                        <Link className="btn btn--ghost" to="/cart">
                            View Cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
