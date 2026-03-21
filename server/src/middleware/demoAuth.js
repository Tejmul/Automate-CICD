const { z } = require('zod');

// Simple demo auth: user is passed via header. Replace with real auth later if needed.
const headerSchema = z.object({
  'x-user-email': z.string().email(),
  'x-user-name': z.string().min(1).optional(),
});

function demoAuth(req, res, next) {
  const parsed = headerSchema.safeParse(req.headers);
  if (!parsed.success) {
    return res.status(401).json({
      status: 'error',
      message: 'Missing auth header. Provide x-user-email (and optional x-user-name).',
    });
  }

  req.user = {
    email: parsed.data['x-user-email'],
    name: parsed.data['x-user-name'],
  };

  return next();
}

module.exports = { demoAuth };
