const Joi = require("joi");

// ==================== LISTING SCHEMA ====================
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
      .min(0)
      .required()
  }).required()
});

// ==================== REVIEW SCHEMA ====================
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number()
      .min(1)
      .max(5)
      .required(),

    comment: Joi.string()
      .min(10)
      .max(500)
      .required()
  }).required()
});
