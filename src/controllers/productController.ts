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
  updateProduct,
} from '../services/productService'

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
  } catch (error) {
    next(error)
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
    const { slug } = req.params
    const data = req.body
    if (req.file) {
      data.image = req.file.path
      // to delete the image from the public folder
      const product = await findProduct(slug)
      if (product.image !== 'public/images/default.png') {
        fs.unlink(product.image)
      }
    }

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
