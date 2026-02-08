const Joi = require('joi');

// ---------- LISTING SCHEMA ----------
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .min(5)
      .max(100)
      .required()
      .messages({
        "string.empty": "Title cannot be empty",
        "string.min": "Title should be at least 5 characters",
        "string.max": "Title cannot exceed 100 characters",
      }),
    description: Joi.string()
      .min(20)
      .max(1000)
      .required()
      .messages({
        "string.empty": "Description cannot be empty",
        "string.min": "Description should be at least 20 characters",
        "string.max": "Description cannot exceed 1000 characters",
      }),
    location: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.empty": "Location cannot be empty",
        "string.pattern.base": "Location can only contain letters and spaces",
      }),
    country: Joi.string()
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        "string.empty": "Country cannot be empty",
        "string.pattern.base": "Country can only contain letters and spaces",
      }),
    price: Joi.number()
      .min(0)
      .required()
      .messages({
        "number.base": "Price must be a number",
        "number.min": "Price cannot be negative",
        "any.required": "Price is required",
      }),
    image: Joi.object({
      url: Joi.string().uri(),
      filename: Joi.string(),
    }).allow(null), // allow null for no image
  }).required(),
});

// ---------- REVIEW SCHEMA ----------
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number()
      .min(1)
      .max(5)
      .required()
      .messages({
        "number.base": "Rating must be a number",
        "number.min": "Rating must be at least 1",
        "number.max": "Rating cannot exceed 5",
        "any.required": "Rating is required",
      }),
    comment: Joi.string()
      .min(10)
      .max(500)
      .required()
      .messages({
        "string.empty": "Comment cannot be empty",
        "string.min": "Comment should be at least 10 characters",
        "string.max": "Comment cannot exceed 500 characters",
      }),
  }).required(),
});
