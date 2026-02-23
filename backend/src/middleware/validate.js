export const validate = (validations) => {
  return async (req, res, next) => {
    const results = await Promise.all(validations.map(v => v.run(req)));
    const errors = results
      .filter(r => !r.isEmpty())
      .flatMap(r => r.array().map(e => e.msg));
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }
    next();
  };
};
