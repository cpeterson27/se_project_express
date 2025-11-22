const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message("Invalid URL format");
};

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field is required',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageURL" field is required',
      "string.uri": 'The "ImageURL" field must be a valid URL',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      }),
      avatar: Joi.string().custom(validateURL).messages({
        'string.uri': 'The "avatar" field must be a valid URL',
      }),
      email: Joi.string().required().email().messages({
        'string.email': 'The "email" field must be a valid email address',
        'string.empty': 'The "email" field is required',
      }),
      password: Joi.string().required().messages({
        'string.empty': 'The "password" field is required',
      }),
    }),
  });

  const validateAuthentication = celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().messages({
        'string.email': 'The "email" field must be a valid email address',
        'string.empty': 'The "email" field is required',
      }),
      password: Joi.string().required().messages({
        'string.empty': 'The "password" field is required',
      }),
    })
  });

  const validateId = celebrate({
      params: Joi.object().keys({
        id: Joi.string().hex().length(24).required().messages({
          'string.length': 'The "id" must be 24 hexadecimal characters',
          'string.hex': 'The "id" must contain only hexadecimal characters',
        }),
      }),
    });

module.exports = {
  validateClothingItem,
  validateUserBody,
  validateAuthentication,
  validateId,
  };