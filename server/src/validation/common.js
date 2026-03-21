const { z } = require('zod');

const zCuid = z.string().min(1);
const zProductId = z.coerce.number().int().positive();

module.exports = { z, zCuid, zProductId };
