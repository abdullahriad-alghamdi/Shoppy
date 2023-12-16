/*======= External Dependencies and Modules =======*/
import { Router } from 'express'

/*======= Internal Modules or Files =======*/
import {
  updatedOrderById,
  deleteOrderById,
  getOrdersAdmin,
  getOrderForUser,
  handlePayment,
} from '../controllers/orderControllers'
// Middlewares
import { isLoggedIn, isAdmin } from '../middlewares/auth'
import { orderValidate } from '../middlewares/validation'

const router = Router()

/**======================
 **    Users Routes
 *========================**/

// POST : /orders/process-payment -> returned new order
router.post('/process-payment', isLoggedIn, orderValidate, handlePayment)
// Get : /orders/:id -> returned order for user
router.get('/:id([0-9a-fA-F]{24})', isLoggedIn, getOrderForUser)

/**======================
 **    Admin Routes
 *========================**/

// Get : /orders/all-orders -> returned order for user
router.get('/all-orders', isLoggedIn, isAdmin, getOrdersAdmin)
// PUT : /orders/:id -> returned updated order
router.put('/:id', isLoggedIn, isAdmin, orderValidate, updatedOrderById)
// DELETE : /orders/:slug -> returned updated order
router.delete('/:id', isLoggedIn, isAdmin, deleteOrderById)

export default router
