import Joi from "joi";

export const likeValidationSchema = Joi.object({
  blogId: Joi.string().hex().length(24).required(),
});
