import { HttpError } from "./http";
import { FIXTURE_PRODUCTS } from "./fixtureData";

const productsById = new Map(FIXTURE_PRODUCTS.map((p) => [p.id, p]));

let cartQuantities = new Map();
let wishlistIds = new Set();
let orders = [];

function delay(value) {
  return Promise.resolve(value);
}

function categoriesList() {
  const set = new Set(FIXTURE_PRODUCTS.map((p) => p.category).filter(Boolean));
  return [...set].sort();
}

function filterProducts({ q, category } = {}) {
  let list = [...FIXTURE_PRODUCTS];
  if (category) {
    list = list.filter(
      (p) => p.category.toLowerCase() === String(category).toLowerCase(),
    );
  }
  if (q && String(q).trim()) {
    const needle = String(q).trim().toLowerCase();
    list = list.filter((p) => {
      const hay = [
        p.title,
        p.description,
        p.category,
        p.brand,
        ...(p.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }
  return list;
}

export const fixtureApi = {
  health() {
    return delay({
      status: "ok",
      message: "Client fixture (no backend)",
      timestamp: new Date().toISOString(),
    });
  },

  auth: {
    login() {
      return delay({
        accessToken: "fixture-token",
        refreshToken: "fixture-refresh",
      });
    },
    refresh() {
      return delay({ accessToken: "fixture-token" });
    },
    me() {
      return delay({ email: "demo@fixture.local", name: "Demo Shopper" });
    },
  },

  products: {
    list({ q, limit = 24, skip = 0 } = {}) {
      const filtered = filterProducts({ q });
      const total = filtered.length;
      const products = filtered.slice(skip, skip + limit);
      return delay({ products, total, skip, limit });
    },

    get(id) {
      const num = Number(id);
      const p = productsById.get(num);
      if (!p) {
        return Promise.reject(
          new HttpError("Product not found", {
            status: 404,
            body: { status: "error", message: "Product not found" },
          }),
        );
      }
      return delay({ ...p });
    },

    categories() {
      return delay({ categories: categoriesList() });
    },

    byCategory({ category, limit = 24, skip = 0 } = {}) {
      const filtered = filterProducts({ category });
      const total = filtered.length;
      const products = filtered.slice(skip, skip + limit);
      return delay({ products, total, skip, limit });
    },
  },

  cart: {
    get() {
      const items = [...cartQuantities.entries()].map(
        ([productId, quantity]) => ({
          productId,
          quantity,
          id: `fixture-cart-${productId}`,
        }),
      );
      return delay({ items });
    },

    add({ productId, quantity = 1 }) {
      if (!productsById.has(Number(productId))) {
        return Promise.reject(
          new HttpError("Unknown product", { status: 400, body: {} }),
        );
      }
      const prev = cartQuantities.get(productId) || 0;
      const next = prev + quantity;
      cartQuantities.set(productId, next);
      return delay({
        productId,
        quantity: next,
        id: `fixture-cart-${productId}`,
      });
    },

    setQuantity({ productId, quantity }) {
      if (!cartQuantities.has(productId)) {
        return Promise.reject(
          new HttpError("Not in cart", { status: 404, body: {} }),
        );
      }
      cartQuantities.set(productId, quantity);
      return delay({
        productId,
        quantity,
        id: `fixture-cart-${productId}`,
      });
    },

    remove(productId) {
      cartQuantities.delete(productId);
      return delay(null);
    },

    clear() {
      cartQuantities = new Map();
      return delay(null);
    },
  },

  wishlist: {
    get() {
      const items = [...wishlistIds].map((productId) => ({
        productId,
        id: `fixture-wish-${productId}`,
      }));
      return delay({ items });
    },

    add(productId) {
      wishlistIds.add(productId);
      return delay({
        productId,
        id: `fixture-wish-${productId}`,
      });
    },

    remove(productId) {
      wishlistIds.delete(productId);
      return delay(null);
    },
  },

  orders: {
    list({ status } = {}) {
      let list = orders;
      if (status) {
        list = list.filter((o) => o.status === status);
      }
      return delay({ orders: list });
    },

    get(id) {
      const order = orders.find((o) => o.id === id);
      if (!order) {
        return Promise.reject(
          new HttpError("Order not found", {
            status: 404,
            body: { status: "error", message: "Order not found" },
          }),
        );
      }
      return delay({ ...order });
    },

    create({ currency = "USD" } = {}) {
      if (cartQuantities.size === 0) {
        return Promise.reject(
          new HttpError("Cart is empty", {
            status: 400,
            body: { status: "error", message: "Cart is empty" },
          }),
        );
      }

      const items = [];
      for (const [productId, quantity] of cartQuantities.entries()) {
        const p = productsById.get(productId);
        const suffix = `${Date.now()}-${productId}`;
        items.push({
          id: `fixture-oi-${suffix}`,
          productId,
          title: p ? p.title : `Product ${productId}`,
          price: p ? p.price : 0,
          quantity,
        });
      }

      const order = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `ord-${Date.now()}`,
        status: "PAID",
        currency,
        createdAt: new Date().toISOString(),
        items,
      };
      orders = [order, ...orders];
      cartQuantities = new Map();
      return delay(order);
    },
  },
};
