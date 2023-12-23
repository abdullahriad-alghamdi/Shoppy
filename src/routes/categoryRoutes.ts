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
import { categoryUpdateValidate, categoryValidate } from '../middlewares/validation'

const router = Router()

// /**======================
//  **    All Routes
//  *========================**/

// // GET : categories -> returned all category
// router.get('/', getAllCategories)

// // GET : /categories/:slug-> returned a single category by slug
// router.get('/:slug', getCategoryBySlug)

// /**======================
//  **    Admin Routes
//  *========================**/

// // POST : /categories ->  create new category
// router.post('/', isLoggedIn, isAdmin, categoryValidate, createCategory)

// // PUT : /categories/:slug -> update single category by slug
// router.put('/:slug', isLoggedIn, isAdmin, categoryValidate, updateCategoryBySlug)

// // DELETE : /categories/:slug -> delete single category by slug
// router.delete('/:slug', isLoggedIn, isAdmin, deleteCategoryBySlug)

/**======================
 **    All Routes
 *========================**/

// GET : categories -> returned all category
router.get('/', getAllCategories)

// GET : /categories/:slug-> returned a single category by slug
router.get('/:slug', getCategoryBySlug)

/**======================
 **    Admin Routes
 *========================**/

// POST : /categories ->  create new category
router.post('/', categoryValidate, createCategory)

// PUT : /categories/:slug -> update single category by slug
router.put('/:slug', categoryUpdateValidate, updateCategoryBySlug)

// DELETE : /categories/:slug -> delete single category by slug
router.delete('/:slug', deleteCategoryBySlug)

export default router
