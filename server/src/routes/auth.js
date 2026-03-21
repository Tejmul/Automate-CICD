const express = require('express');
const { z } = require('zod');
const { validate } = require('../middleware/validate');
const { loginUser, refreshAuthToken, getAuthUser } = require('../services/dummyjson');

const router = express.Router();

router.post(
  '/login',
  validate(
    z.object({
      body: z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      }),
    }),
  ),
  async (req, res, next) => {
    try {
      const { username, password } = req.validated.body;
      const data = await loginUser(username, password);
      res.json(data);
    } catch (e) {
      next(e);
    }
  },
);

router.post(
  '/refresh',
  validate(
    z.object({
      body: z.object({
        refreshToken: z.string().min(1),
      }),
    }),
  ),
  async (req, res, next) => {
    try {
      const { refreshToken } = req.validated.body;
      const data = await refreshAuthToken(refreshToken);
      res.json(data);
    } catch (e) {
      next(e);
    }
  },
);

router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Missing access token' });
    }
    const data = await getAuthUser(token);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
