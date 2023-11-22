import { NextFunction, Request, Response } from 'express'

import { productUpdateType } from '../types/productTypes'
import {
  createNewProduct,
  deleteProduct,
  findProduct,
  paginateProducts,
  updateProduct,
} from '../services/productService'

// Get : /products -> get all products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || undefined
    const limit = Number(req.query.limit) || undefined
    const { products, totalPages, currentPage } = await paginateProducts(page, limit)

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
    const product = await findProduct(req.params.slug)
    res.json({
      message: 'Get a single product by slug successfully',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

// post : /products -> create new product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const img = req.file?.path
    await createNewProduct(req.body, img)
    res.status(201).json({ message: 'file added successfully' })
  } catch (err) {
    next(err)
  }
}

// Put : /products/:slug -> update product by slug
export const updateProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product: productUpdateType = await updateProduct(req.params.slug, req.body)
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
    const product = await deleteProduct(req.params.slug)
    res.json({
      message: 'Delete product by slug successfully',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}
