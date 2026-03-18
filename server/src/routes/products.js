const express = require('express');
const { validate } = require('../middleware/validate');
const { z, zProductId } = require('../validation/common');
const { listProducts, listCategories, listProductsByCategory, getProduct } = require('../services/dummyjson');

const router = express.Router();

router.get('/categories', async (req, res, next) => {
  try {
    const categories = await listCategories();
    res.json({ categories });
  } catch (e) {
    next(e);
  }
});

router.get(
  '/category/:category',
  validate(
    z.object({
      params: z.object({
        category: z.string().min(1),
      }),
      query: z.object({
        limit: z.coerce.number().int().min(1).max(100).optional(),
        skip: z.coerce.number().int().min(0).optional(),
      }),
    }),
  ),
  async (req, res, next) => {
    try {
      const { limit, skip } = req.validated.query;
      const category = req.validated.params.category;
      const data = await listProductsByCategory({ category, limit, skip });
      res.json(data);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  '/',
  validate(
    z.object({
      query: z.object({
        q: z.string().min(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional(),
        skip: z.coerce.number().int().min(0).optional(),
      }),
    }),
  ),
  async (req, res, next) => {
    try {
      const { q, limit, skip } = req.validated.query;
      const data = await listProducts({ q, limit, skip });
      res.json(data);
    } catch (e) {
      next(e);
    }
  },
);

router.get(
  '/:id',
  validate(
    z.object({
      params: z.object({
        id: zProductId,
      }),
    }),
  ),
  async (req, res, next) => {
    try {
      const product = await getProduct(req.validated.params.id);
      res.json(product);
    } catch (e) {
      next(e);
    }
  },
);

module.exports = router;

