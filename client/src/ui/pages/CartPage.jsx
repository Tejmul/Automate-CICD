import { Link } from "react-router-dom";
import {
  useCartWithProducts,
  useCartActions,
  useCheckout,
} from "../hooks/useStorefront";
import { InlineError, EmptyState, Skeleton } from "../components/State";
import { Price } from "../components/Price";

export function CartPage() {
  const { lines, subtotal, isLoading, error } = useCartWithProducts();
  const cartActions = useCartActions();
  const checkout = useCheckout();

  return (
    <div className="page">
      <div className="cart__top">
        <div>
          <div className="pagekicker">Cart</div>
          <h2 className="pagetitle">Your Shopping Bag</h2>
          <p className="pagesub">
            {lines.length > 0
              ? `${lines.length} item${lines.length > 1 ? "s" : ""} in your cart`
              : "Your cart is empty"}
          </p>
        </div>
      </div>

      {error ? (
        <InlineError title="Couldn't load cart" message={error.message} />
      ) : isLoading ? (
        <div className="cart__grid">
          <div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="cartrow">
                <div className="cartrow__img cartrow__img--ph" />
                <div>
                  <Skeleton className="skel--line" />
                  <Skeleton className="skel--line skel--line2" />
                </div>
              </div>
            ))}
          </div>
          <div />
        </div>
      ) : lines.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Start adding products to fill your shopping bag."
          action={
            <Link className="btn btn--primary" to="/shop">
              Start Shopping
            </Link>
          }
        />
      ) : (
        <div className="cart__grid">
          <div>
            {lines.map((line) => (
              <div key={line.productId} className="cartrow">
                {line.product?.thumbnail ? (
                  <img
                    className="cartrow__img"
                    src={line.product.thumbnail}
                    alt={line.product?.title || ""}
                  />
                ) : (
                  <div className="cartrow__img cartrow__img--ph" />
                )}

                <div>
                  <Link
                    to={`/product/${line.productId}`}
                    className="cartrow__title"
                  >
                    {line.product?.title || `Product #${line.productId}`}
                  </Link>
                  <div className="cartrow__meta">
                    <Price value={line.unitPrice} />
                    <span className="dot" aria-hidden="true">
                      ·
                    </span>

                    <div className="qty">
                      <button
                        className="qty__btn"
                        type="button"
                        disabled={
                          line.quantity <= 1 ||
                          cartActions.setQuantity.isPending
                        }
                        onClick={() =>
                          cartActions.setQuantity.mutate({
                            productId: line.productId,
                            quantity: line.quantity - 1,
                          })
                        }
                      >
                        −
                      </button>
                      <span className="qty__val">{line.quantity}</span>
                      <button
                        className="qty__btn"
                        type="button"
                        disabled={cartActions.setQuantity.isPending}
                        onClick={() =>
                          cartActions.setQuantity.mutate({
                            productId: line.productId,
                            quantity: line.quantity + 1,
                          })
                        }
                      >
                        +
                      </button>
                    </div>

                    <span className="dot" aria-hidden="true">
                      ·
                    </span>
                    <Price value={line.lineTotal} />

                    <button
                      className="linkbtn"
                      type="button"
                      onClick={() => cartActions.remove.mutate(line.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="panel panel--sticky">
            <div className="panel__title">Order Summary</div>
            <div className="summary">
              <div className="summary__row">
                <span className="muted">Subtotal</span>
                <Price value={subtotal} />
              </div>
              <div className="summary__row">
                <span className="muted">Shipping</span>
                <span className="muted">Free</span>
              </div>
              <div className="summary__row summary__row--total">
                <span>Total</span>
                <Price value={subtotal} />
              </div>
            </div>

            <button
              className="btn btn--primary"
              type="button"
              style={{ width: "100%" }}
              disabled={checkout.isPending}
              onClick={() => checkout.mutate()}
            >
              {checkout.isPending ? "Processing…" : "Checkout"}
            </button>

            {checkout.error && (
              <InlineError
                title="Checkout failed"
                message={checkout.error.message}
              />
            )}

            {checkout.isSuccess && (
              <div
                className="state"
                style={{
                  marginTop: 12,
                  borderColor: "rgba(52,211,153,0.2)",
                  background: "rgba(52,211,153,0.06)",
                }}
              >
                <div
                  className="state__title"
                  style={{ color: "var(--success)" }}
                >
                  Order placed! 🎉
                </div>
                <p className="state__msg">
                  <Link to="/orders" style={{ color: "var(--accent)" }}>
                    View your orders →
                  </Link>
                </p>
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <button
                className="linkbtn"
                style={{ width: "100%", textAlign: "center" }}
                type="button"
                onClick={() => cartActions.clear.mutate()}
              >
                Clear cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
