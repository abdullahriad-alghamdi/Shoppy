/*======= External Dependencies and Modules =======*/
import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'

/*======= Internal Modules or Files =======*/
// Utils
import { createHTTPError } from '../utils/createError'

// Product Validation
export const productValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10),
    price: Joi.number().required(),
    quantity: Joi.number().min(1).required(),
    category: Joi.string().min(3).max(50).required(),
    image: Joi.string(),
  })

  const { error, value } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    console.log(error)
    const errorDetails = error.details.map((detail) => {
      return {
        message: detail.message,
        path: detail.path,
      }
    })
    throw createHTTPError(400, errorDetails)
  } else {
    // If validation passes, attach the validated data to req.body
    req.body = value
    return next()
  }
}

// update Product Validation
export const productUpdateValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().min(10),
    price: Joi.number(),
    quantity: Joi.number().min(1),
    category: Joi.string().min(3).max(50),
    image: Joi.string(),
  })

  const { error, value } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    console.log(error)
    const errorDetails = error.details.map((detail) => {
      return {
        message: detail.message,
        path: detail.path,
      }
    })
    throw createHTTPError(400, errorDetails)
  } else {
    // If validation passes, attach the validated data to req.body
    req.body = value
    return next()
  }
}

// User Validation
export const userValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(15).required(),
    name: Joi.string().min(3).max(300).required(),
    email: Joi.string().email().min(3).max(300).required(),
    password: Joi.string().min(6).required(),
    image: Joi.string(),
    address: Joi.string().min(3).required(),
    phone: Joi.number().required(),
  })

  const { error, value } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    console.log(error)
    const errorDetails = error.details.map((detail) => {
      return {
        message: detail.message,
        path: detail.path,
      }
    })
    throw createHTTPError(400, errorDetails)
  } else {
    // If validation passes, attach the validated data to req.body
    req.body = value
    return next()
  }
}

// User Validation
export const adminValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(15).required(),
    name: Joi.string().min(3).max(300).required(),
    email: Joi.string().email().min(3).max(300).required(),
    password: Joi.string().min(6).required(),
    image: Joi.string(),
    address: Joi.string().min(3).required(),
    phone: Joi.number().required(),
    isAdmin: Joi.boolean().default(false),
    isBanned: Joi.boolean().default(false),
  })

  const { error, value } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    console.log(error)
    const errorDetails = error.details.map((detail) => {
      return {
        message: detail.message,
        path: detail.path,
      }
    })
    throw createHTTPError(400, errorDetails)
  } else {
    // If validation passes, attach the validated data to req.body
    req.body = value
    return next()
  }
}

// Category Validation
export const categoryValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
  })

  const { error, value } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    console.log(error)
    const errorDetails = error.details.map((detail) => {
      return {
        message: detail.message,
        path: detail.path,
      }
    })
    throw createHTTPError(400, errorDetails)
  } else {
    // If validation passes, attach the validated data to req.body
    req.body = value
    return next()
  }
}

// Order Validation
export const orderValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().required(),
          quantity: Joi.number().required().min(1),
        })
      )
      .min(1)
      .required(),
    payment: Joi.object().min(1).required(),
    status: Joi.string(),
    buyer: Joi.string().required(),
    shipping: Joi.object().keys({
      address: Joi.string().required(),
      city: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
    }),
  })

  const { error, value } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    console.log(error)
    const errorDetails = error.details.map((detail) => {
      return {
        message: detail.message,
        path: detail.path,
      }
    })
    throw createHTTPError(400, errorDetails)
  } else {
    // If validation passes, attach the validated data to req.body
    req.body = value
    return next()
  }
}

// order update Validation
export const orderUpdateValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().required(),
          quantity: Joi.number().required().min(1),
        })
      )
      .min(0) // Update: Minimum of 1 product required
      .optional(),
    status: Joi.string().valid('pending', 'Processed', 'shipped', 'delivered'),
    buyer: Joi.string().optional(),
    shipping: Joi.object().keys({
      address: Joi.string(),
      city: Joi.string(),
      postalCode: Joi.string(),
      country: Joi.string(),
    }),
    payment: Joi.object().keys({
      method: Joi.string(),
      amount: Joi.number(),
    }),
  })

  const { error, value } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    console.log(error)
    const errorDetails = error.details.map((detail) => {
      return {
        message: detail.message,
        path: detail.path,
      }
    })
    throw createHTTPError(400, errorDetails)
  } else {
    // If validation passes, attach the validated data to req.body
    req.body = value
    return next()
  }
}
