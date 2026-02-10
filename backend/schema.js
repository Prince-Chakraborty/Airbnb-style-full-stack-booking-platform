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
      .required(),

    // ✅ ADD TYPE HERE
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
    
    // OPTIONAL IMAGE
    image: Joi.object({
      url: Joi.string().uri(),
      filename: Joi.string(),
    }).allow(null),
  }).required()
});
