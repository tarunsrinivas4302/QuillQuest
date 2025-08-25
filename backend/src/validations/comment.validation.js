import Joi from "joi";

export const commentValidationSchema = Joi.object({
  blogId: Joi.string().hex().length(24).required(),
  content: Joi.string().trim().min(1).max(1000).required(),
  parentComment: Joi.string().hex().length(24).allow(null, ''),
});
