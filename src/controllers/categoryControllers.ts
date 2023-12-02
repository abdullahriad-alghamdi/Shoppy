/*======= External Dependencies and Modules =======*/
import { Request, Response, NextFunction } from 'express'
import mongoose, { Error } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Utils
import { createHTTPError } from '../utils/createError'
// Services
import {
  createNewCategory,
  deleteCategory,
  findCategory,
  getCategories,
  updateCategory,
} from '../services/categoryServices'

/**======================
 **   User controllers
 *========================**/

// GET : /categories -> returned all category
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.query

    let page = Number(data.page) || undefined
    const limit = Number(data.limit) || undefined
    const search = data.search as string
    const sort = data.sort as string
    const { categories, totalPages, currentPage } = await getCategories(page, limit, search, sort)

    if (data.search) {
      res.status(200).json({
        message: 'Categories you are searching for:',
        payload: categories,
        totalPages,
        currentPage,
      })
    }

    res.status(200).json({
      message: 'Categories retrieved successfully!',
      payload: categories,
      totalPages,
      currentPage,
    })
  } catch (error) {
    return next(error)
  }
}

/**======================
 **   Admin controllers
 *========================**/

// GET :/categories/:slug-> returned single category
export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const newCategory = await findCategory(slug)

    res.status(200).json({ message: 'Category retrieved successfully!', payload: newCategory })
  } catch (error) {
    return next(error)
  }
}

// GET :/categories/-> Create new category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body
    const newProduct = await createNewCategory(title)

    res.status(201).json({ message: 'Category created successfully!', payload: newProduct })
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

// PUT :/categories/:slug -> update a category by slug
export const updateCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body
    const { slug } = req.params
    const { updatedCategory } = await updateCategory(slug, title)
    await updatedCategory?.save()

    res.status(200).json({ message: 'Category updated successfully!', payload: updatedCategory })
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

// DELETE :/categories/:slug -> delete a category by slug
export const deleteCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    const category = await deleteCategory(slug)
    res.status(200).json({ message: 'delete category Successfully!', payload: category })
  } catch (error) {
    return next(error)
  }
}
