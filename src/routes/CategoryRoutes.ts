import { Router } from 'express'

import {
  getAllCategory,
  getCategoryBySlug,
  createCategory,
  updateCategoryBySlug,
  deleteCategoryBySlug,
} from '../controllers/categoryController'

const router = Router()
// GET : /category -> returned all category
router.get('/', getAllCategory)
// GET : /category/:slug-> returned a single category by slug
router.get('/:slug', getCategoryBySlug)
// POST : /category ->  create new category
router.post('/', createCategory)
// PUT : /category/:slug -> update single category by slug
router.put('/:slug', updateCategoryBySlug)
// DELETE : /category/:slug -> delete single category by slug
router.delete('/:slug', deleteCategoryBySlug)

export default router
