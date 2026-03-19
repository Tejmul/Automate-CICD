import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../hooks/useStorefront'

function NavItem({ to, children }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => (isActive ? 'navlink navlink--active' : 'navlink')}
        >
            {children}
        </NavLink>
    )
}

export function TopNav() {
    const { data: cartItems = [] } = useCart()
    const [menuOpen, setMenuOpen] = useState(false)

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false)
    }, [])

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <>
            <header className="topnav">
                <div className="topnav__inner">
                    <Link to="/" className="brand">
                        <span className="brand__mark" aria-hidden="true">S</span>
                        <span className="brand__word">ShopSmart</span>
                    </Link>

                    <nav className="nav">
                        <NavItem to="/">Home</NavItem>
                        <NavItem to="/shop">Shop</NavItem>
                        <NavItem to="/wishlist">Wishlist</NavItem>
                        <NavItem to="/orders">Orders</NavItem>
                    </nav>

                    <div className="topnav__right">
                        <Link className="pill" to="/cart" id="cart-nav-link">
                            🛒 Cart
                            {cartCount > 0 && (
                                <span className="pill__badge">{cartCount}</span>
                            )}
                        </Link>
                        <button
                            className="hamburger"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
                <button className="mobile-menu__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                    ✕
                </button>
                <Link className="mobile-menu__link" to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link className="mobile-menu__link" to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
                <Link className="mobile-menu__link" to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
                <Link className="mobile-menu__link" to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
                <Link className="mobile-menu__link" to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
            </div>
        </>
    )
}
