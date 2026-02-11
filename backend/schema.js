const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .min(5)
      .max(100)
      .required(),
    description: Joi.string()
      .min(20)
      .max(1000)
      .required(),
    location: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .required(),
    country: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .required(),
    price: Joi.number()
      .min(1)
      .required()
      .messages({
        "number.base": "Price must be a valid positive number",
        "number.min": "Price must be greater than 0",
        "any.required": "Price is required",
      }),
    type: Joi.string()
      .valid(
        "trending",
        "rooms",
        "iconic",
        "mountains",
        "castles",
        "pools",
        "camping",
        "farms",
        "arctic",
        "domes",
        "boats"
      )
      .required(),
  }).required(),
});