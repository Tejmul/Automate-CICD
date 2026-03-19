import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './CartDrawer.css'

export function CartDrawer({ open, onClose, cart, cartActions }) {
  const lines = cart?.lines || []
  const subtotal = cart?.subtotal || 0

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div className={`drawer-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Cart drawer">
        <div className="cart-drawer__header">
          <div>
            <p className="label-gold">Your Cart</p>
            <h2 className="cart-drawer__title">
              {lines.length} {lines.length === 1 ? 'Item' : 'Items'}
            </h2>
          </div>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cart-drawer__body">
          {lines.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p className="cart-drawer__empty-title">Your cart is empty</p>
              <p className="cart-drawer__empty-text">Add items from the shop to get started</p>
              <Link to="/shop" className="btn-primary" onClick={onClose} style={{ marginTop: 20 }}>
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="cart-drawer__items">
              {lines.map((line) => (
                <div key={line.productId} className="cart-item">
                  <div className="cart-item__img-wrap">
                    {line.product?.thumbnail ? (
                      <img src={line.product.thumbnail} alt={line.product.title} className="cart-item__img" />
                    ) : (
                      <div className="skeleton" style={{ width: '100%', height: '100%' }} />
                    )}
                  </div>
                  <div className="cart-item__info">
                    <p className="cart-item__brand label-sm">{line.product?.brand || line.product?.category || 'Item'}</p>
                    <p className="cart-item__name">{line.product?.title || `Product #${line.productId}`}</p>
                    <p className="cart-item__price">${Number(line.unitPrice || 0).toFixed(2)}</p>
                    <div className="cart-item__controls">
                      <div className="cart-item__qty">
                        <button
                          onClick={() => cartActions.setQuantity.mutate({ productId: line.productId, quantity: line.quantity - 1 })}
                          disabled={line.quantity <= 1 || cartActions.setQuantity.isPending}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          onClick={() => cartActions.setQuantity.mutate({ productId: line.productId, quantity: line.quantity + 1 })}
                          disabled={cartActions.setQuantity.isPending}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button className="cart-item__remove" onClick={() => cartActions.remove.mutate(line.productId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal">
              <span>Subtotal</span>
              <span>${Number(subtotal).toFixed(2)}</span>
            </div>
            <div className="cart-drawer__subtotal cart-drawer__subtotal--muted">
              <span>Shipping</span>
              <span>{subtotal > 99 ? 'Free' : '$9.99'}</span>
            </div>
            <div className="cart-drawer__divider" />
            <div className="cart-drawer__subtotal cart-drawer__subtotal--total">
              <span>Total</span>
              <span>${(Number(subtotal) + (subtotal > 99 ? 0 : 9.99)).toFixed(2)}</span>
            </div>
            <Link
              to="/cart"
              className="btn-primary"
              onClick={onClose}
              style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
            >
              Checkout
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <button className="cart-drawer__clear" onClick={() => cartActions.clear.mutate()}>
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  )
}

