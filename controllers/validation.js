const { Validator, ValidationError } = require("jsonschema");

const movieValidationSchema = require("../schemas/movie.json").definitions.newmovie;
const movieUpdateValidationSchema = require("../schemas/movie.json").definitions.updatemovie;
const tvshowValidationSchema = require("../schemas/tvshow.json").definitions.newtvshow;
const tvshowUpdateValidationSchema = require("../schemas/tvshow.json").definitions.updatetvshow;
const userValidationSchema = require("../schemas/user.json");
const celebValidationSchema = require("../schemas/celeb.json");

const makeKoaValidator = (schema, resource) => {
  const v = new Validator();
  const validationOptions = {
    throwError: true,
    propertyName: resource,
  };

  const handler = async (ctx, next) => {
    const body = ctx.request.body;

    try {
      v.validate(body, schema, validationOptions);
      await next();
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(error);
        ctx.status = 400;
        ctx.body = error;
      } else {
        throw error;
      }
    }
  };
  return handler;
};

exports.validateNewMovie = makeKoaValidator(movieValidationSchema, "newmovie");
exports.validateUpdateMovie = makeKoaValidator(movieUpdateValidationSchema,"updatemovie");
exports.validateNewTvshow = makeKoaValidator(tvshowValidationSchema, "newtvshow");
exports.validateUpdateTvshow = makeKoaValidator(tvshowUpdateValidationSchema,"updatetvshow");
exports.validateUser = makeKoaValidator(userValidationSchema, "user");
exports.validateCeleb = makeKoaValidator(celebValidationSchema, "celeb");
