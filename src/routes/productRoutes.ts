/*======= External Dependencies and Modules =======*/
import { Router } from 'express'

/*======= Internal Modules or Files =======*/
// Controllers
import { uploadProductImg } from '../middlewares/uploadFiles'
import {
  createProduct,
  deleteProductBySlug,
  getAllProducts,
  getProductBySlug,
  updateProductBySlug,
} from '../controllers/productControllers'

const router: Router = Router()

// Get : /products -> get all products
router.get('/', getAllProducts)

// Get : /products/:slug -> get product by slug
router.get('/:slug', getProductBySlug)

// Post : /products -> create new product
router.post('/', uploadProductImg.single('image'), createProduct)

// Put : /products/:slug -> update product by slug
router.put('/:slug', uploadProductImg.single('image'), updateProductBySlug)

// Delete : /products/:slug -> delete product by slug
router.delete('/:slug', deleteProductBySlug)

export default router
