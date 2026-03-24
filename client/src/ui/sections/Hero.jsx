import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useStorefront";

export function Hero() {
  const { data } = useProducts({ limit: 6 });
  const featured = data?.products?.slice(0, 3) || [];
  const primary = featured[0];

  const pickHeroImage = (p, idx = 0) => {
    const images = Array.isArray(p?.images) ? p.images : [];
    return images[idx] || images[0] || p?.thumbnail || "";
  };

  return (
    <section className="hero2">
      <div className="container hero2__inner">
        <div className="hero2__left">
          <div className="hero2__kicker">ShopSmart</div>
          <h1 className="hero2__title">
            Unleash Your Style
            <br />
            Shop the Latest Trends
          </h1>
          <p className="hero2__sub">
            Discover the latest trends &amp; express your style effortlessly.
            Shop exclusive collections with premium designs, just for you!
          </p>
          <div className="hero2__actions">
            <Link to="/shop" className="btn-primary hero2__cta">
              Shop Now
            </Link>
          </div>

          <div className="hero2__reviews">
            <div className="hero2__reviewsStat">15 Million+</div>
            <div className="hero2__reviewsText">
              Real reviews from our happy customers! See what fashion lovers are
              saying about our quality, style, and service.
            </div>
          </div>
        </div>

        <div className="hero2__right" aria-hidden="true">
          <div className="hero2__frame">
            <div className="hero2__img hero2__img--single">
              {primary ? (
                <img src={pickHeroImage(primary, 0)} alt="" loading="eager" />
              ) : (
                <div className="hero2__ph hero2__ph--gradient" />
              )}
            </div>
          </div>
          <div className="hero2__caption">
            <div className="hero2__capTitle">Shop everything you need</div>
            <div className="hero2__capCta">Explore now</div>
          </div>
        </div>
      </div>
    </section>
  );
}
