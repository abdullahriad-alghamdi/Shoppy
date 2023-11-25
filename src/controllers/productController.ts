import fs from 'fs/promises'
/*======= External Dependencies and Modules =======*/
import { NextFunction, Request, Response } from 'express'

/*======= Internal Modules or Files =======*/
// Types
import { productUpdateType } from '../types/productTypes'
// Services
import {
  createNewProduct,
  deleteProduct,
  findProduct,
  paginateProducts,
  replaceImage,
  updateProduct,
} from '../services/productService'
import { Error } from 'mongoose'
import { createHTTPError } from '../utils/createError'

// Get : /products -> get all products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.query

    let page = Number(data.page) || undefined
    const limit = Number(data.limit) || undefined
    const maxPrice = Number(data.maxPrice) || undefined
    const minPrice = Number(data.minPrice) || undefined

    const { products, totalPages, currentPage } = await paginateProducts(
      page,
      limit,
      maxPrice,
      minPrice
    )

    res.json({
      message: 'Get all products successfully',
      payload: products,
      totalPages,
      currentPage,
    })
  } catch (error) {
    next(error)
  }
}

// Get : /products/:slug -> get product by slug
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = req.params

    const product = await findProduct(params.slug)
    res.json({
      message: 'Get a single product by slug successfully',
      payload: product,
    })
  } catch (err) {
    if (err instanceof Error.ValidationError){
      // If it's a validation error, extract error messages
      const errorMessages = Object.values(err.errors).map((err) => err.message);

      // Send a response with the validation error messages
      res.status(400).json({ errors: errorMessages });

      next(createHTTPError(400,errorMessages.join(', ')))
  } else {
    next(err);
  }
  }
}

// post : /products -> create new product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file
    const img = file?.path
    const data = req.body

    const product = await createNewProduct(data, img)

    res.status(201).json({ message: 'Product added successfully', payload: product })
  } catch (err) {
    next(err)
  }
}

// Put : /products/:slug -> update product by slug
export const updateProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params, body, file } = req
    const { slug } = params
    const data = body

    // replace the old image with the new image in the file system
    replaceImage(file, slug, data)

    const product: productUpdateType = await updateProduct(slug, data)
    if (!product) {
      throw {
        message: 'Product not found',
        statusCode: 404,
      }
    }
    res.json({
      message: 'Update product by slug successfully',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

// Delete : /products/:slug -> delete product by slug
export const deleteProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    const product = await deleteProduct(slug)
    res.json({
      message: 'Delete product by slug successfully',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}
