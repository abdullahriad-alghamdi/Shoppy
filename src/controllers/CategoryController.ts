/*======= External Dependencies and Modules =======*/
import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

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
} from '../services/categoryService'

// GET : /categories -> returned all category
export const getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getCategories()

    res.status(200).json({ message: 'get all Category Successfully!', payload: categories })
  } catch (err) {
    next(err)
  }
}

// GET :/categories/:slug-> returned single category
export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const newProduct = await findCategory(slug)

    res.status(200).json({ message: 'get Category Successfully!', payload: newProduct })
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(createHTTPError(400, 'id format not valid'))
    } else {
      next(err)
    }
  }
}

// GET :/categories/-> Create new category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body
    const newProduct = await createNewCategory(title)

    res.status(201).json({ message: 'create Category Successfully!', payload: newProduct })
  } catch (err) {
    next(err)
  }
}

// PUT :/categories/:slug -> update a category by slug
export const updateCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body
    const { slug } = req.params
    const { updatedCategory } = await updateCategory(slug, title)
    await updatedCategory?.save()
    res.status(200).json({ message: 'update product Successfully!', payload: updatedCategory })
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(createHTTPError(400, 'id format not valid'))
    } else {
      next(err)
    }
  }
}

// DELETE :/categories/:slug -> delete a category by slug
export const deleteCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    const category = await deleteCategory(slug)
    res.status(200).json({ message: 'delete product Successfully!', payload: category })
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(createHTTPError(400, 'id format not valid'))
    } else {
      next(err)
    }
  }
}
