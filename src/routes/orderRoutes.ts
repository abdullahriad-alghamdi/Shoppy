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

const router = Router()

// GET : /order -> returned all order
router.get('/', getAllOrders)

// GET : /orders/:slug -> returned single order
router.get('/:id', getOrderById)

// POST : /orders -> returned new order
router.post('/', createOrder)

// PUT : /orders/:id -> returned updated order
router.put('/:id', updatedOrderById)

// DELETE : /orders/:slug -> returned updated order
router.delete('/:id', deleteOrderById)

export default router
