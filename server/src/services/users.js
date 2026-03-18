const { prisma } = require('../db/prisma');

async function ensureUserByEmail({ email, name }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;
  return prisma.user.create({ data: { email, name } });
}

module.exports = { ensureUserByEmail };

