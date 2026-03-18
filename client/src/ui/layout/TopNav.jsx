import { Link, NavLink } from 'react-router-dom'

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
    return (
        <header className="topnav">
            <div className="topnav__inner">
                <Link to="/" className="brand">
                    <span className="brand__mark" aria-hidden="true">
                        ◼
                    </span>
                    <span className="brand__word">ShopSmart</span>
                </Link>

                <nav className="nav">
                    <NavItem to="/">Home</NavItem>
                    <NavItem to="/shop">Shop</NavItem>
                    <NavItem to="/wishlist">Wishlist</NavItem>
                    <NavItem to="/orders">Orders</NavItem>
                </nav>

                <div className="topnav__right">
                    <Link className="pill" to="/cart">
                        Cart
                    </Link>
                    <a className="pill" href="/api/health" target="_blank" rel="noreferrer">
                        API
                    </a>
                </div>
            </div>
        </header>
    )
}

