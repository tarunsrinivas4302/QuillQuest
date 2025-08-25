import Joi from "joi";

export const blogValidationSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  content: Joi.string().trim().min(10).required(),
  category: Joi.string().trim().min(3).max(50).required(),
  tags: Joi.array().items(Joi.string().trim().max(30)), // Array of strings
  image: Joi.string().uri().optional(), // Validate URL if provided
  isPublished: Joi.boolean().optional(),
});
