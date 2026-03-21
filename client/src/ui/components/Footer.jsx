import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-mark">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2L17.3 6.25V13.75L10 18L2.7 13.75V6.25L10 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span>ShopSmart</span>
            </div>
            <p className="footer__tagline">
              Premium curated goods.
              <br />
              Discover, wishlist, own.
            </p>
            <div className="footer__social">
              {["instagram", "twitter", "pinterest"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="footer__social-link"
                  aria-label={s}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" opacity="0.1" />
                    <text
                      x="12"
                      y="16"
                      textAnchor="middle"
                      fontSize="10"
                      fill="currentColor"
                    >
                      {s[0].toUpperCase()}
                    </text>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <p className="footer__col-head label-sm">Shop</p>
              <Link to="/shop" className="footer__link">
                All Products
              </Link>
              <Link to="/shop?category=beauty" className="footer__link">
                Beauty
              </Link>
              <Link to="/shop?category=fragrances" className="footer__link">
                Fragrances
              </Link>
              <Link to="/shop?category=furniture" className="footer__link">
                Furniture
              </Link>
              <Link to="/wishlist" className="footer__link">
                Wishlist
              </Link>
            </div>
            <div className="footer__col">
              <p className="footer__col-head label-sm">Account</p>
              <Link to="/orders" className="footer__link">
                Orders
              </Link>
              <Link to="/wishlist" className="footer__link">
                Saved Items
              </Link>
              <Link to="/cart" className="footer__link">
                Cart
              </Link>
            </div>
            <div className="footer__col">
              <p className="footer__col-head label-sm">Built With</p>
              <span className="footer__link">React + Vite</span>
              <span className="footer__link">Express + Prisma</span>
              <span className="footer__link">DummyJSON API</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2025 ShopSmart. All rights reserved.</p>
          <p>Crafted with precision</p>
        </div>
      </div>
    </footer>
  );
}
