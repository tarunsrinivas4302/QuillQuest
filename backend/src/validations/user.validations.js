import Joi from "joi";

export const registerValidation = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
  profileImage: Joi.object()
  .optional()
  .allow(null)  // ✅ Allow null value
  .custom((value, helpers) => {
    if (value && value.size > 5 * 1024 * 1024) {
      return helpers.error("any.invalid");
    }
    return value;
  })
  .messages({
    "any.invalid": "Profile image must be a valid file under 5MB",
  }),

});


export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(50).required(),
});

export const oauthValidation = Joi.object({
  provider: Joi.string().valid("google", "github").required(),
  accessToken: Joi.string().required(),
});

export const refreshTokenValidation = Joi.object({
  refreshToken: Joi.string().required(),
});
