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

async function listProducts({ q, limit = 24, skip = 0 } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('skip', String(skip));
  if (q) params.set('q', q);

  if (q) {
    return dummyFetch(`/products/search?${params.toString()}`);
  }
  return dummyFetch(`/products?${params.toString()}`);
}

async function listCategories() {
  return dummyFetch('/products/categories');
}

async function listProductsByCategory({ category, limit = 24, skip = 0 } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('skip', String(skip));
  return dummyFetch(`/products/category/${encodeURIComponent(String(category))}?${params.toString()}`);
}

async function getProduct(id) {
  return dummyFetch(`/products/${encodeURIComponent(String(id))}`);
}

module.exports = { listProducts, listCategories, listProductsByCategory, getProduct };

