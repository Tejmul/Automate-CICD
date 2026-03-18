import { Link } from 'react-router-dom'
import { Price } from './Price'

export function ProductCard({ product }) {
    const img = product?.image
    return (
        <Link to={`/product/${product.id}`} className="pcard">
            <div className="pcard__media">
                {img ? (
                    <img className="pcard__img" src={img} alt={product.name} loading="lazy" />
                ) : (
                    <div className="pcard__img pcard__img--ph" aria-hidden="true" />
                )}
            </div>
            <div className="pcard__body">
                <div className="pcard__title">{product.name}</div>
                <div className="pcard__meta">
                    <Price value={Number(product.priceCents) / 100} />
                    <span className="dot" aria-hidden="true">
                        ·
                    </span>
                    <span className="muted">{product.subCategory}</span>
                </div>
            </div>
        </Link>
    )
}

