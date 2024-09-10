import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import { BadRequestException, NotFoundException, ServerException, UnauthorizedException } from "./customException.js";
import * as yup from "yup";

function formatPrismaValidationError(error) {
  if (error.name === 'PrismaClientValidationError') {
    let formattedMessage = error.message
      .replace(/\n/g, ' ')
      .replace(/Invalid `(.+?)` invocation:/, 'There was an error with the following query:')
      .replace(/\{([^}]+)\}/g, (match, p1) => `\nDetails: ${p1.trim()}`)
      .replace(/Argument `(.+?)`: Invalid value provided\./g, 'The field `$1`: The provided value is incorrect.')
      .replace(/Expected (.+?), provided (.+?)\./g, 'Expected a `$1`, but got a `$2`.');

    formattedMessage = formattedMessage.replace(/\s+/g, ' ');

    return formattedMessage;
  } else {
    return error.message;
  }
}

const errorHandlers = {
  [PrismaClientValidationError]: (error) => new BadRequestException({ msg: formatPrismaValidationError(error) }),
  [PrismaClientKnownRequestError]: (error, location, operation) => {
    if (error.code === "P2025") {
      const target = error.meta.target || error.meta.modelName;

      return new NotFoundException({ msg: `${target} not found` });
    } else if (error.code === "P2002") {
      const model = error.meta.modelName
      const target = error.meta.target[0]

      throw new BadRequestException({
          msg: `${model} ${target} must be unique`
      })
  }
    return new ServerException({
      msg: "Internal server error, please try again later.",
      data: {
        meta: {
          location: location,
          operation: operation,
          time: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString()
        }
      }
    });
  },
  [yup.ValidationError]: (error) => new BadRequestException({ msg: "data validation error", data: error.errors }),
};

export function handleError(error, location, operation) {
  if (errorHandlers[error.constructor]) {
    throw errorHandlers[error.constructor](error, location, operation);
  } else if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof UnauthorizedException) {
    throw error;
  } else {
    console.log(error);
    throw new ServerException({
      msg: "Internal server error, please try again later.",
      data: {
        meta: {
          location: location,
          operation: operation,
          time: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString()
        }
      }
    });
  }
}

export function returnError(error, res) {
  try {
    return res.status(error.code).json({
      message: error.message,
      data: error.data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error, please try again later.",
      data: {
        meta: {
          location: "unknown",
          operation: "unknown",
          time: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString()
        }
      }
    })
  }
}