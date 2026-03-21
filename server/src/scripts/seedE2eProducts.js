/**
 * Ensures at least one product exists for Playwright E2E (empty DB after migrate).
 * Skips if products are already present (e.g. after catalog sync in dev).
 */
require('dotenv').config();
const { prisma } = require('../db/prisma');

async function main() {
  const n = await prisma.product.count();
  if (n > 0) {
    console.log(`seedE2eProducts: skip (${n} products already)`);
    return;
  }

  await prisma.product.create({
    data: {
      id: 900001,
      title: 'E2E Sample Hoodie',
      description: 'Seeded for automated browser tests.',
      price: 49.99,
      category: 'tops',
      brand: 'ShopSmart',
      thumbnail: '',
      stock: 10,
    },
  });
  console.log('seedE2eProducts: inserted sample product');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
