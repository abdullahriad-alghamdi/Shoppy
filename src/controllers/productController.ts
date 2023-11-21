import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'

import { Product } from '../models/productSchema'
import { product, productUpdate } from '../types/productTypes'

// Get : /products -> get all products
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find()
    console.log('products', products)
    res.json({
      message: 'Get all products successfully',
      payload: products,
    })
  } catch (error) {
    next(error)
  }
}

// Get : /products/:slug -> get product by slug
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
    if (!product) {
      throw {
        message: 'Product not found',
        statusCode: 404,
      }
    }
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
    const { title, description, price, countInStock, sold } = req.body
    const slugifiedTitle = slugify(title, { lower: true })
    const product: product = await Product.create({
      title,
      slug: slugifiedTitle ? slugifiedTitle : '',
      description,
      price,
      countInStock,
      sold,
    })
    console.log('product', product)
    if (!product) {
      throw {
        message: 'Sorry you cannot create product, product not found',
        statusCode: 400,
      }
    }

    res.json({
      message: 'Create product successfully',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

// Put : /products/:slug -> update product by slug
export const updateProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product: productUpdate = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    )
    //todo  TODO  update the slug if the title is updated

    if (!product) {
      throw {
        message: 'Sorry you cannot update, product not found',
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
    const product = await Product.findOneAndDelete({ slug: req.params.slug })
    if (!product) {
      throw {
        message: 'Sorry you cannot delete, product not found',
        statusCode: 404,
      }
    }
    res.json({
      message: 'Delete product by slug successfully',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}
