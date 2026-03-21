import { useMemo, useState } from "react";
import {
  useCategories,
  useProducts,
  useCartActions,
  useWishlist,
  useWishlistActions,
} from "../hooks/useStorefront";
import { CategoryChips } from "../components/CategoryChips";
import { ProductCard } from "../components/ProductCard";
import { EmptyState, InlineError, Skeleton } from "../components/State";

export function CatalogPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(null);

  const {
    data: categories = [],
    isLoading: catsLoading,
    error: catsError,
  } = useCategories();

  const query = useMemo(() => q.trim() || undefined, [q]);
  const { data, isLoading, error } = useProducts({
    q: query,
    category,
    limit: 24,
    skip: 0,
  });
  const products = data?.products || [];
  const total = data?.total || 0;

  const cartActions = useCartActions();
  const { data: wishlistItems = [] } = useWishlist();
  const wishlistSet = useMemo(
    () => new Set(wishlistItems.map((x) => x.productId)),
    [wishlistItems],
  );
  const wishActions = useWishlistActions();

  const handleQuickAdd = (productId) => {
    cartActions.add.mutate({ productId, quantity: 1 });
  };

  const handleWishlistToggle = (productId) => {
    if (wishlistSet.has(productId)) wishActions.remove.mutate(productId);
    else wishActions.add.mutate(productId);
  };

  return (
    <div className="page">
      <div className="catalog__top">
        <div>
          <div className="pagekicker">Shop</div>
          <h2 className="pagetitle">Discover Premium Products</h2>
          <p className="pagesub">
            {total > 0 ? `${total} products` : "Search, filter, and explore."}
          </p>
        </div>

        <div className="search">
          <input
            className="search__input"
            id="search-products"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
          />
        </div>
      </div>

      {catsError ? (
        <InlineError
          title="Couldn't load categories"
          message={catsError.message}
        />
      ) : (
        <div className="catalog__chips">
          {catsLoading ? (
            <div className="chips">
              <Skeleton className="chip skel--chip" />
              <Skeleton className="chip skel--chip" />
              <Skeleton className="chip skel--chip" />
              <Skeleton className="chip skel--chip" />
            </div>
          ) : (
            <CategoryChips
              categories={categories}
              value={category}
              onChange={setCategory}
            />
          )}
        </div>
      )}

      {error ? (
        <InlineError title="Couldn't load products" message={error.message} />
      ) : isLoading ? (
        <div className="grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="pcard pcard--skel">
              <div className="pcard__media">
                <div className="pcard__img pcard__img--ph" />
              </div>
              <div className="pcard__body">
                <Skeleton className="skel--line" />
                <Skeleton className="skel--line skel--line2" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No matches"
          message="Try a different search or switch categories."
          action={
            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => {
                setQ("");
                setCategory(null);
              }}
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickAdd={handleQuickAdd}
              isWishlisted={wishlistSet.has(p.id)}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
