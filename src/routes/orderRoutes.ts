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


// PUT : /orders/:id -> returned updated order
router.put('/:id', isLoggedIn, isAdmin, updatedOrderById)
// DELETE : /orders/:slug -> returned updated order
router.delete('/:id', isLoggedIn, isAdmin, deleteOrderById)
// POST : /orders/process-payment -> returned new order
router.post('/process-payment',isLoggedIn, handlePayment)
// Get : /orders/:id -> returned order for user
router.get('/:id([0-9a-fA-F]{24})',isLoggedIn, getOrderForUser)
// Get : /orders/all-orders -> returned order for user
router.get('/all-orders',isLoggedIn,isAdmin, getOrdersAdmin)

export default router
