import { apiFetch } from "./http";
import { fixtureApi } from "./fixtureApi";

/** Use in-memory fixture data (no HTTP). Vitest sets MODE=test → real apiFetch mapping tests. Set VITE_USE_API=true to talk to the backend. */
const useFixture =
  import.meta.env.MODE !== "test" && import.meta.env.VITE_USE_API !== "true";

function via(fnReal, fnMock) {
  return useFixture ? fnMock() : fnReal();
}

export const api = {
  health() {
    return via(
      () => apiFetch("/api/health"),
      () => fixtureApi.health(),
    );
  },

  auth: {
    login({ username, password }) {
      return via(
        () =>
          apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
          }),
        () => fixtureApi.auth.login({ username, password }),
      );
    },
    refresh(refreshToken) {
      return via(
        () =>
          apiFetch("/api/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
          }),
        () => fixtureApi.auth.refresh(refreshToken),
      );
    },
    me(accessToken) {
      return via(
        () =>
          apiFetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        () => fixtureApi.auth.me(accessToken),
      );
    },
  },

  products: {
    list({ q, limit = 24, skip = 0 } = {}) {
      return via(
        () => {
          const params = new URLSearchParams();
          if (q) params.set("q", q);
          params.set("limit", String(limit));
          params.set("skip", String(skip));
          return apiFetch(`/api/products?${params.toString()}`);
        },
        () => fixtureApi.products.list({ q, limit, skip }),
      );
    },
    get(id) {
      return via(
        () => apiFetch(`/api/products/${encodeURIComponent(String(id))}`),
        () => fixtureApi.products.get(id),
      );
    },
    categories() {
      return via(
        () => apiFetch("/api/products/categories"),
        () => fixtureApi.products.categories(),
      );
    },
    byCategory({ category, limit = 24, skip = 0 } = {}) {
      return via(
        () => {
          const params = new URLSearchParams();
          params.set("limit", String(limit));
          params.set("skip", String(skip));
          return apiFetch(
            `/api/products/category/${encodeURIComponent(String(category))}?${params.toString()}`,
          );
        },
        () => fixtureApi.products.byCategory({ category, limit, skip }),
      );
    },
  },

  cart: {
    get() {
      return via(
        () => apiFetch("/api/cart"),
        () => fixtureApi.cart.get(),
      );
    },
    add({ productId, quantity = 1 }) {
      return via(
        () =>
          apiFetch("/api/cart", {
            method: "POST",
            body: JSON.stringify({ productId, quantity }),
          }),
        () => fixtureApi.cart.add({ productId, quantity }),
      );
    },
    setQuantity({ productId, quantity }) {
      return via(
        () =>
          apiFetch(`/api/cart/${encodeURIComponent(String(productId))}`, {
            method: "PATCH",
            body: JSON.stringify({ quantity }),
          }),
        () => fixtureApi.cart.setQuantity({ productId, quantity }),
      );
    },
    remove(productId) {
      return via(
        () =>
          apiFetch(`/api/cart/${encodeURIComponent(String(productId))}`, {
            method: "DELETE",
          }),
        () => fixtureApi.cart.remove(productId),
      );
    },
    clear() {
      return via(
        () => apiFetch("/api/cart", { method: "DELETE" }),
        () => fixtureApi.cart.clear(),
      );
    },
  },

  wishlist: {
    get() {
      return via(
        () => apiFetch("/api/wishlist"),
        () => fixtureApi.wishlist.get(),
      );
    },
    add(productId) {
      return via(
        () =>
          apiFetch("/api/wishlist", {
            method: "POST",
            body: JSON.stringify({ productId }),
          }),
        () => fixtureApi.wishlist.add(productId),
      );
    },
    remove(productId) {
      return via(
        () =>
          apiFetch(`/api/wishlist/${encodeURIComponent(String(productId))}`, {
            method: "DELETE",
          }),
        () => fixtureApi.wishlist.remove(productId),
      );
    },
  },

  orders: {
    list({ status } = {}) {
      return via(
        () => {
          const params = new URLSearchParams();
          if (status) params.set("status", status);
          const qs = params.toString();
          return apiFetch(`/api/orders${qs ? `?${qs}` : ""}`);
        },
        () => fixtureApi.orders.list({ status }),
      );
    },
    get(id) {
      return via(
        () => apiFetch(`/api/orders/${encodeURIComponent(String(id))}`),
        () => fixtureApi.orders.get(id),
      );
    },
    create({ currency } = {}) {
      return via(
        () =>
          apiFetch("/api/orders", {
            method: "POST",
            body: JSON.stringify({ currency }),
          }),
        () => fixtureApi.orders.create({ currency }),
      );
    },
  },
};
