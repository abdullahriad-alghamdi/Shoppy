/*======= External Dependencies and Modules =======*/
import { Router } from 'express'

/*======= Internal Modules or Files =======*/

// Controllers
import {
  createProduct,
  deleteProductBySlug,
  getAllProducts,
  getProductBySlug,
  updateProductBySlug,
} from '../controllers/productControllers'

// Middlewares
import { isLoggedIn, isAdmin } from '../middlewares/auth'
import { uploadProductImg } from '../middlewares/uploadFiles'
import { productValidate } from '../middlewares/validation'

const router: Router = Router()

// Get : /products -> get all products
router.get('/', getAllProducts)

// Get : /products/:slug -> get product by slug
router.get('/:slug', getProductBySlug)

// Post : /products -> create new product
router.post('/', isLoggedIn, isAdmin, uploadProductImg, createProduct)

// Put : /products/:slug -> update product by slug
router.put('/:slug', isLoggedIn, isAdmin, uploadProductImg, updateProductBySlug)

// Delete : /products/:slug -> delete product by slug
router.delete('/:slug', isLoggedIn, isAdmin, deleteProductBySlug)

export default router
