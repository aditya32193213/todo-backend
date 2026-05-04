// Accepts an optional body schema and an optional query schema.
// Either can be null if only one side needs validating.
const validate = (bodySchema, querySchema = null) => (req, res, next) => {
  if (bodySchema) {
    const { error } = bodySchema.validate(req.body, { abortEarly: false });
    if (error) {
      const message = error.details.map((d) => d.message.replace(/"/g, "'")).join(", ");
      return res.status(400).json({ success: false, message });
    }
  }

  if (querySchema) {
    const { error } = querySchema.validate(req.query, { abortEarly: false });
    if (error) {
      const message = error.details.map((d) => d.message.replace(/"/g, "'")).join(", ");
      return res.status(400).json({ success: false, message });
    }
  }

  next();
};

export default validate;