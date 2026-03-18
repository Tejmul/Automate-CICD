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
    const items = await prisma.cartItem.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
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
        quantity: z.coerce.number().int().min(1).max(99).default(1),
      }),
    }),
  ),
  async (req, res, next) => {
    try {
      const user = await ensureUserByEmail(req.user);
      const { productId, quantity } = req.validated.body;

      const item = await prisma.cartItem.upsert({
        where: { userId_productId: { userId: user.id, productId } },
        update: { quantity: { increment: quantity } },
        create: { userId: user.id, productId, quantity },
      });

      res.status(201).json(item);
    } catch (e) {
      next(e);
    }
  },
);

router.patch(
  '/:productId',
  validate(
    z.object({
      params: z.object({ productId: zProductId }),
      body: z.object({
        quantity: z.coerce.number().int().min(1).max(99),
      }),
    }),
  ),
  async (req, res, next) => {
    try {
      const user = await ensureUserByEmail(req.user);
      const productId = req.validated.params.productId;
      const { quantity } = req.validated.body;

      const item = await prisma.cartItem.update({
        where: { userId_productId: { userId: user.id, productId } },
        data: { quantity },
      });

      res.json(item);
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

      await prisma.cartItem.delete({
        where: { userId_productId: { userId: user.id, productId } },
      });

      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
);

router.delete('/',
  async (req, res, next) => {
    try {
      const user = await ensureUserByEmail(req.user);
      await prisma.cartItem.deleteMany({ where: { userId: user.id } });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
);

module.exports = router;

