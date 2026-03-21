const { prisma } = require('../db/prisma');
const { listAllProducts } = require('./dummyjson');

function normalizeProduct(p) {
  const id = Number(p.id);
  if (!Number.isInteger(id) || id <= 0) throw new Error(`Invalid product id: ${p.id}`);

  return {
    id,
    title: String(p.title || '').trim(),
    description: String(p.description || '').trim(),
    price: Number(p.price) || 0,
    discountPercentage: Number(p.discountPercentage) || 0,
    rating: Number(p.rating) || 0,
    stock: Number(p.stock) || 0,
    brand: String(p.brand || '').trim(),
    thumbnail: String(p.thumbnail || '').trim(),
    images: JSON.stringify(Array.isArray(p.images) ? p.images : []),
    category: String(p.category || '').trim(),
    tags: JSON.stringify(Array.isArray(p.tags) ? p.tags : []),
  };
}

async function syncProductsFromRemote() {
  const data = await listAllProducts();
  const items = Array.isArray(data.products) ? data.products : [];
  const normalized = items.map(normalizeProduct).filter((p) => p.title);

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
            { title: { contains: q } },
            { description: { contains: q } },
            { category: { contains: q } },
            { brand: { contains: q } },
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

  return {
    products: products.map(enrichProduct),
    total,
    skip,
    limit,
  };
}

async function getProduct(id) {
  const product = await prisma.product.findUnique({ where: { id } });
  return product ? enrichProduct(product) : null;
}

/** Parse JSON string fields back to arrays for the API response */
function enrichProduct(p) {
  return {
    ...p,
    images: safeParse(p.images),
    tags: safeParse(p.tags),
  };
}

function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

module.exports = { syncProductsFromRemote, listCategories, listProducts, getProduct };
