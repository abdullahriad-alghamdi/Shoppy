/*======= External Dependencies and Modules =======*/
import { NextFunction, Request, Response } from 'express'
import { Error } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Types
import { productUpdateType } from '../types/productTypes'
// Services
import {
  getProducts,
  findProduct,
  createNewProduct,
  updateProduct,
  deleteProduct,
} from '../services/productServices'
// Utils
import { createHTTPError } from '../utils/createError'

/**======================
 **      User controllers
 *========================**/

// Get : /products -> get all products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.query

    let page = Number(data.page) || undefined
    const limit = Number(data.limit) || undefined
    const maxPrice = Number(data.maxPrice) || undefined
    const minPrice = Number(data.minPrice) || undefined
    const search = data.search as string
    const categoryId = (data.categoryId as string) || undefined
    const sort = data.sort as string

    const { products, pagination, searchBy } = await getProducts(
      page,
      limit,
      maxPrice,
      minPrice,
      search,
      categoryId,
      sort
    )

    if (data.search) {
      res.status(200).json({
        message: 'Products you are searching for:',
        payload: products,
        pagination,
        searchBy,
      })
      return
    } else if (data.categoryId) {
      res.status(200).json({
        message: 'Products in this category:',
        payload: products,
        pagination,
        searchBy,
      })
      return
    } else {
      res.status(200).json({
        message: '  Products retrieved successfully!',
        payload: products,
        pagination,
        searchBy,
      })
    }
  } catch (error) {
    return next(error)
  }
}

// Get : /products/:slug -> get product by slug
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    const product = await findProduct(slug)
    res.status(200).json({
      message: 'Get a single product by slug successfully',
      payload: product,
    })
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((error) => error.message)
      res.status(400).json({ errors: errorMessages })
      next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      return next(error)
    }
  }
}

/**========================
 **      Admin controllers
 *=========================**/

// post : /products -> create new product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file
    const img = file?.path
    const data = req.body

    const product = await createNewProduct(data, img)

    res.status(201).json({ message: 'Product added successfully', payload: product })
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((error) => error.message)
      return next(createHTTPError(400, errorMessages))
    } else {
      return next(error)
    }
  }
}

// Put : /products/:slug -> update product by slug
export const updateProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params, body, file } = req
    const { slug } = params
    const data = body

    const product: productUpdateType = data && (await updateProduct(slug, data, file?.path!))
    if (!product) {
      throw createHTTPError(404, `Product with slug ${slug} does not exist`)
    }

    res.status(200).json({
      message: 'Update product by slug successfully',
      payload: product,
    })
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((error) => error.message)
      return next(createHTTPError(400, errorMessages))
    } else {
      return next(error)
    }
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
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((error) => error.message)
      return next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      return next(error)
    }
  }
}
