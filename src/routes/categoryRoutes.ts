/*======= External Dependencies and Modules =======*/
import { Router } from 'express'

/*======= Internal Modules or Files =======*/
// Controllers
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategoryBySlug,
  deleteCategoryBySlug,
} from '../controllers/categoryControllers'
// Middlewares
import { isLoggedIn, isAdmin } from '../middlewares/auth'
import { categoryValidate } from '../middlewares/validation'

const router = Router()

/**======================
 **    All Routes
 *========================**/

// GET : /category -> returned all category
router.get('/', getAllCategories)

// GET : /category/:slug-> returned a single category by slug
router.get('/:slug', getCategoryBySlug)

/**======================
 **    Admin Routes
 *========================**/

// POST : /category ->  create new category
router.post('/', isLoggedIn, isAdmin, categoryValidate, createCategory)

// PUT : /category/:slug -> update single category by slug
router.put('/:slug', isLoggedIn, isAdmin, categoryValidate, updateCategoryBySlug)

// DELETE : /category/:slug -> delete single category by slug
router.delete('/:slug', isLoggedIn, isAdmin, deleteCategoryBySlug)

export default router
