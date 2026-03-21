const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

async function dummyFetch(path, init) {
  const url = `${DUMMYJSON_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      accept: 'application/json',
      ...(init && init.headers ? init.headers : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`DummyJSON request failed: ${res.status} ${res.statusText}`);
    err.statusCode = res.status;
    err.details = text;
    throw err;
  }

  return res.json();
}

// ── Products ──────────────────────────────────────────────

async function listProducts({ q, limit = 24, skip = 0, sortBy, order } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('skip', String(skip));
  if (q) params.set('q', q);
  if (sortBy) params.set('sortBy', sortBy);
  if (order) params.set('order', order);

  if (q) {
    return dummyFetch(`/products/search?${params.toString()}`);
  }
  return dummyFetch(`/products?${params.toString()}`);
}

async function listAllProducts() {
  return dummyFetch('/products?limit=0');
}

async function listCategories() {
  return dummyFetch('/products/categories');
}

async function listProductsByCategory({ category, limit = 24, skip = 0 } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('skip', String(skip));
  return dummyFetch(
    `/products/category/${encodeURIComponent(String(category))}?${params.toString()}`,
  );
}

async function getProduct(id) {
  return dummyFetch(`/products/${encodeURIComponent(String(id))}`);
}

// ── Auth ──────────────────────────────────────────────────

async function loginUser(username, password) {
  return dummyFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
}

async function refreshAuthToken(refreshToken) {
  return dummyFetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken, expiresInMins: 60 }),
  });
}

async function getAuthUser(accessToken) {
  return dummyFetch('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

module.exports = {
  listProducts,
  listAllProducts,
  listCategories,
  listProductsByCategory,
  getProduct,
  loginUser,
  refreshAuthToken,
  getAuthUser,
};
