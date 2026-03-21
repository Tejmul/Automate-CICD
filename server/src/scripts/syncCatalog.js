require('dotenv').config();
const { syncProductsFromRemote } = require('../services/catalog');

async function main() {
  const result = await syncProductsFromRemote();
  console.log(`Synced products: ${result.count}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
