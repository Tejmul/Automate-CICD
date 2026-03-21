function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse({
      params: req.params,
      query: req.query,
      body: req.body,
      headers: req.headers,
    });

    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        issues: parsed.error.issues,
      });
    }

    req.validated = parsed.data;
    return next();
  };
}

module.exports = { validate };
