import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useCart,
  useCartWithProducts,
  useWishlist,
  useCartActions,
} from "../hooks/useStorefront";
import { CartDrawer } from "../components/CartDrawer";
import "./Navbar.css";

function NavbarChrome({
  location,
  scrolled,
  cartItems,
  wishlistItems,
  cartWithProducts,
  cartActions,
}) {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const cartCount = useMemo(
    () => cartItems.reduce((s, i) => s + (i.quantity || 0), 0),
    [cartItems],
  );
  const wishlistCount = wishlistItems.length;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner container">
          <Link to="/" className="navbar__logo">
            <div className="navbar__logo-mark">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2L17.3 6.25V13.75L10 18L2.7 13.75V6.25L10 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="navbar__logo-text">ShopSmart</span>
          </Link>

          <nav className="navbar__nav">
            <Link
              to="/"
              className={`navbar__link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`navbar__link ${isActive("/shop") ? "active" : ""}`}
            >
              Shop
            </Link>
            <Link
              to="/wishlist"
              className={`navbar__link ${isActive("/wishlist") ? "active" : ""}`}
            >
              Wishlist
              {wishlistCount > 0 && (
                <span className="navbar__badge">{wishlistCount}</span>
              )}
            </Link>
            <Link
              to="/orders"
              className={`navbar__link ${isActive("/orders") ? "active" : ""}`}
            >
              Orders
            </Link>
          </nav>

          <div className="navbar__actions">
            <button
              className="navbar__icon-btn"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            <Link
              to="/wishlist"
              className="navbar__icon-btn"
              aria-label="Wishlist"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && <span className="navbar__dot" />}
            </Link>

            <button
              className="navbar__cart-btn"
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="navbar__cart-count">{cartCount}</span>
              )}
            </button>

            <button
              className="navbar__hamburger"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Menu"
            >
              <span className={mobileOpen ? "open" : ""}></span>
              <span className={mobileOpen ? "open" : ""}></span>
            </button>
          </div>
        </div>

        <div
          className={`navbar__search ${searchOpen ? "navbar__search--open" : ""}`}
        >
          <div className="container">
            <div className="navbar__search-inner">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search products, brands, categories..."
                className="navbar__search-input"
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
              />
              <button
                className="navbar__search-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`navbar__mobile ${mobileOpen ? "navbar__mobile--open" : ""}`}
        >
          <Link to="/" className="navbar__mobile-link">
            Home
          </Link>
          <Link to="/shop" className="navbar__mobile-link">
            Shop
          </Link>
          <Link to="/wishlist" className="navbar__mobile-link">
            Wishlist
          </Link>
          <Link to="/orders" className="navbar__mobile-link">
            Orders
          </Link>
        </div>
      </header>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cartWithProducts}
        cartActions={cartActions}
      />
    </>
  );
}

export function Navbar() {
  const location = useLocation();
  const { data: cartItems = [] } = useCart();
  const { data: wishlistItems = [] } = useWishlist();
  const cartActions = useCartActions();
  const cartWithProducts = useCartWithProducts();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <NavbarChrome
      key={location.pathname}
      location={location}
      scrolled={scrolled}
      cartItems={cartItems}
      wishlistItems={wishlistItems}
      cartWithProducts={cartWithProducts}
      cartActions={cartActions}
    />
  );
}
