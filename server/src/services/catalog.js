const PRODUCTS_URL = 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json';
const { prisma } = require('../db/prisma');

function normalizeProduct(p) {
  const id = Number(p.id);
  if (!Number.isInteger(id) || id <= 0) throw new Error(`Invalid product id: ${p.id}`);

  return {
    id,
    name: String(p.name || '').trim(),
    description: String(p.description || '').trim(),
    image: String(p.image || '').trim(),
    priceCents: Number(p.priceCents) || 0,
    category: String(p.category || '').trim(),
    subCategory: String(p.subCategory || '').trim(),
    keywords: Array.isArray(p.keywords) ? p.keywords.join(',') : String(p.keywords || ''),
    ratingStars: Number(p.rating?.stars) || 0,
    ratingCount: Number(p.rating?.count) || 0,
  };
}

async function syncProductsFromRemote() {
  const res = await fetch(PRODUCTS_URL, { headers: { accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Products fetch failed: ${res.status} ${res.statusText}`);
    err.statusCode = res.status;
    err.details = text;
    throw err;
  }

  const raw = await res.json();
  const items = Array.isArray(raw) ? raw : [];
  const normalized = items.map(normalizeProduct).filter((p) => p.name);

  await prisma.$transaction(
    normalized.map((p) =>
      prisma.product.upsert({
        where: { id: p.id },
        create: p,
        update: p,
      }),
    ),
  );

  return { count: normalized.length };
}

async function listCategories() {
  const rows = await prisma.product.findMany({
    distinct: ['category'],
    select: { category: true },
    orderBy: { category: 'asc' },
  });
  return rows.map((r) => r.category).filter(Boolean);
}

async function listProducts({ q, limit = 24, skip = 0, category } = {}) {
  const where = {
    ...(category ? { category } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { category: { contains: q } },
            { subCategory: { contains: q } },
          ],
        }
      : {}),
  };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: [{ category: 'asc' }, { id: 'asc' }],
      skip,
      take: limit,
    }),
  ]);

  return { products, total, skip, limit };
}

async function getProduct(id) {
  const product = await prisma.product.findUnique({ where: { id } });
  return product;
}

module.exports = { syncProductsFromRemote, listCategories, listProducts, getProduct };

