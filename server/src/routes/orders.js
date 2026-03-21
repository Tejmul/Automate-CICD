const express = require('express');
const { validate } = require('../middleware/validate');
const { z } = require('../validation/common');
const { demoAuth } = require('../middleware/demoAuth');
const { ensureUserByEmail } = require('../services/users');
const { prisma } = require('../db/prisma');

const router = express.Router();

router.use(demoAuth);

router.get(
  '/',
  validate(
    z.object({
      query: z.object({
        status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'CANCELLED']).optional(),
      }),
    }),
  ),
  async (req, res, next) => {
    try {
      const user = await ensureUserByEmail(req.user);
      const status = req.validated.query.status;
      const orders = await prisma.order.findMany({
        where: { userId: user.id, ...(status ? { status } : {}) },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ orders });
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  '/:id',
  validate(
    z.object({
      params: z.object({ id: z.string().min(1) }),
    }),
  ),
  async (req, res, next) => {
    try {
      const user = await ensureUserByEmail(req.user);
      const order = await prisma.order.findFirst({
        where: { id: req.validated.params.id, userId: user.id },
        include: { items: true },
      });
      if (!order) return res.status(404).json({ status: 'error', message: 'Order not found' });
      res.json(order);
    } catch (e) {
      next(e);
    }
  },
);

router.post(
  '/',
  validate(
    z.object({
      body: z.object({
        currency: z.string().min(3).max(3).optional(),
      }),
    }),
  ),
  async (req, res, next) => {
    try {
      const user = await ensureUserByEmail(req.user);
      const cartItems = await prisma.cartItem.findMany({ where: { userId: user.id } });
      if (cartItems.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Cart is empty' });
      }

      const products = await prisma.product.findMany({
        where: { id: { in: cartItems.map((ci) => ci.productId) } },
      });

      const order = await prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
          data: {
            userId: user.id,
            currency: req.validated.body.currency || 'USD',
            items: {
              create: cartItems.map((ci) => {
                const p = products.find((x) => x.id === ci.productId);
                return {
                  productId: ci.productId,
                  title: p ? p.title : `Product ${ci.productId}`,
                  price: p ? Number(p.price) : 0,
                  quantity: ci.quantity,
                };
              }),
            },
          },
          include: { items: true },
        });

        await tx.cartItem.deleteMany({ where: { userId: user.id } });
        return created;
      });

      res.status(201).json(order);
    } catch (e) {
      next(e);
    }
  },
);

module.exports = router;
