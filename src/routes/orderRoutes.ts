/*======= External Dependencies and Modules =======*/
import { Router } from 'express'

/*======= Internal Modules or Files =======*/
import {
  updatedOrderById,
  deleteOrderById,
  getAllOrders,
  getMyOrders,
  handlePayment,
  getUserOrders,
  getSingleOrder,
  getMySingleOrder,
} from '../controllers/orderControllers'
// Middlewares
import { isLoggedIn, isAdmin } from '../middlewares/auth'
import { orderUpdateValidate, orderValidate } from '../middlewares/validation'

const router = Router()

// /**======================
//  **    Users Routes
//  *========================**/

// // POST : /orders/process-payment -> returned new order
// router.post('/process-payment', isLoggedIn, orderValidate, handlePayment)
// // Get : /my-orders -> returned a specific user orders
// router.get('/my-orders', isLoggedIn, getMyOrders)
// // GET : /my-order/:id -> returned a specific order
// router.get('/my-order/:id', isLoggedIn, getMySingleOrder)

// /**======================
//  **    Admin Routes
//  *========================**/

// // Get : /orders/all-orders -> returned order for user
// router.get('/all-orders', isLoggedIn, isAdmin, getAllOrders)
// // GET : /user-orders/:id -> returned a specific user orders
// router.get('/user-orders/:id', isLoggedIn, isAdmin, getUserOrders)
// // GET : /user-order/:id -> returned a specific order
// router.get('/user-order/:id', isLoggedIn, isAdmin, getSingleOrder)
// // PUT : /orders/:id -> returned updated order
// router.put('/:id', isLoggedIn, isAdmin, orderUpdateValidate, updatedOrderById)
// // DELETE : /orders/:slug -> returned updated order
// router.delete('/:id', isLoggedIn, isAdmin, deleteOrderById)

// /**====================.==
//  **   All Routes
//  *========================**/
// // GET :/orders/:id -> Get a single order

/**======================
 **    Users Routes
 *========================**/

// POST : /orders/process-payment -> returned new order
router.post('/process-payment', orderValidate, handlePayment)
// Get : /my-orders -> returned a specific user orders
router.get('/my-orders', getMyOrders)
// GET : /my-order/:id -> returned a specific order
router.get('/my-order/:id', getMySingleOrder)

/**======================
 **    Admin Routes
 *========================**/

// Get : /orders/all-orders -> returned order for user
router.get('/all-orders', getAllOrders)
// GET : /user-orders/:id -> returned a specific user orders
router.get('/user-orders/:id', getUserOrders)
// GET : /user-order/:id -> returned a specific order
router.get('/user-order/:id', getSingleOrder)
// PUT : /orders/:id -> returned updated order
router.put('/:id', orderUpdateValidate, updatedOrderById)
// DELETE : /orders/:slug -> returned updated order
router.delete('/:id', deleteOrderById)

/**====================.==
 **   All Routes
 *========================**/
// GET :/orders/:id -> Get a single order

export default router
