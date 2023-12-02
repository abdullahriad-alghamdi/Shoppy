/*======= External Dependencies and Modules =======*/
import { Router } from 'express'

/*======= Internal Modules or Files =======*/
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updatedOrderById,
  deleteOrderById,
} from '../controllers/orderControllers'
import { isLoggedIn, isAdmin } from '../middlewares/auth'

const router = Router()

// GET : /orders -> returned all order
router.get('/', isLoggedIn, isAdmin, getAllOrders)

// GET : /orders/:slug -> returned single order
router.get('/:id', isLoggedIn, getOrderById)

// POST : /orders -> returned new order
router.post('/', isLoggedIn, createOrder)

// PUT : /orders/:id -> returned updated order
router.put('/:id', isLoggedIn, isAdmin, updatedOrderById)

// DELETE : /orders/:slug -> returned updated order
router.delete('/:id', isLoggedIn, isAdmin, deleteOrderById)

export default router
