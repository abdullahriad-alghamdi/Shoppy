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
    countInStock: Joi.number().min(1).required(),
    category: Joi.string().min(3).max(50).required(),
    image: Joi.string().min(3).required(),
  })

  const { error, value } = schema.validate(req.body)
  if (error) {
    console.log(error)

    createHTTPError(400, error.details[0].message)
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
    email: Joi.string().min(3).max(300).required(),
    password: Joi.string().min(6).required(),
    image: Joi.string(),
    address: Joi.string().min(3).required(),
    phone: Joi.number().required(),
  })

  const { error, value } = schema.validate(req.body)
  if (error) {
    console.log(error)

    createHTTPError(400, error.details[0].message)
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

  const { error, value } = schema.validate(req.body)
  if (error) {
    createHTTPError(400, error.details[0].message)
  } else {
    // If validation passes, attach the validated data to req.body
    req.body = value
    return next()
  }
}

// Order Validation
