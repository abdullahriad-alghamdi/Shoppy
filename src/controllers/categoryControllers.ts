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

// GET : /categories -> returned all category
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getCategories()
    // TODO: check if category is null or uncategorized
    res.status(200).json({ message: ' All Category retrieved Successfully!', payload: categories })
  } catch (err) {
    next(err)
  }
}

// GET :/categories/:slug-> returned single category
export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params
    const newProduct = await findCategory(slug)

    res.status(200).json({ message: 'Category retrieved successfully!', payload: newProduct })
  } catch (err) {
    next(err)
  }
}

// GET :/categories/-> Create new category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body
    const newProduct = await createNewCategory(title)

    res.status(201).json({ message: 'Category created successfully!', payload: newProduct })
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const errorMessages = Object.values(err.errors).map((err) => err.message)
      res.status(400).json({ errors: errorMessages })
      next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      next(err)
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
      const errorMessages = Object.values(error.errors).map((err) => err.message)
      res.status(400).json({ errors: errorMessages })
      next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      next(error)
    }
  }
}

// DELETE :/categories/:slug -> delete a category by slug
export const deleteCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params

    const category = await deleteCategory(slug)
    res.status(200).json({ message: 'delete category Successfully!', payload: category },)
  } catch (error) {
    next(error)
  }
}
