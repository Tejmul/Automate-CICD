const express = require('express');
const { validate } = require('../middleware/validate');
const { z, zProductId } = require('../validation/common');
const { demoAuth } = require('../middleware/demoAuth');
const { ensureUserByEmail } = require('../services/users');
const { prisma } = require('../db/prisma');

const router = express.Router();

router.use(demoAuth);

router.get('/', async (req, res, next) => {
  try {
    const user = await ensureUserByEmail(req.user);
    const items = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.post(
  '/',
  validate(
    z.object({
      body: z.object({
        productId: zProductId,
      }),
    }),
  ),
  async (req, res, next) => {
    try {
      const user = await ensureUserByEmail(req.user);
      const { productId } = req.validated.body;

      const item = await prisma.wishlistItem.upsert({
        where: { userId_productId: { userId: user.id, productId } },
        update: {},
        create: { userId: user.id, productId },
      });

      res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  },
);

router.delete(
  '/:productId',
  validate(
    z.object({
      params: z.object({ productId: zProductId }),
    }),
  ),
  async (req, res, next) => {
    try {
      const user = await ensureUserByEmail(req.user);
      const productId = req.validated.params.productId;

      await prisma.wishlistItem.delete({
        where: { userId_productId: { userId: user.id, productId } },
      });

      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
);

module.exports = router;

