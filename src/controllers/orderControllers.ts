/*======= External Dependencies and Modules =======*/
import { NextFunction, Request, Response } from 'express'
import mongoose, { Error } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Services
import {
  updateOrder,
  deleteOrder,
  saveOrder,
  userOrders,
  allOrders,
  SingleOrder,
  userOrder,
} from '../services/orderServices'
// Utils
import { createHTTPError } from '../utils/createError'
import { CustomRequest } from '../types/userTypes'

/**======================
 **      User controllers
 *========================**/
// POST :/orders/process-payment -> add new user order
export const handlePayment = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const order = req.body
    const user_id = req.user_id
    const newOrder = await saveOrder(order, user_id!)
    res
      .status(201)
      .send({ message: 'Payment was successfully and order was created', payload: newOrder })
  } catch (error) {
    next(error)
  }
}

// GET :/my-orders -> get user order
export const getMyOrders = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user_id as string
    const order = await userOrders(user_id)
    res.status(200).send({ message: 'Orders are returned for the user,', payload: order })
  } catch (error) {
    next(error)
  }
}

// GET :/my-order/:id -> get user order
export const getMySingleOrder = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user_id as string
    const order_id = req.params.id
    const order = await userOrder(user_id, order_id)
    res.status(200).send({ message: 'Orders are returned for the user,', payload: order })
  } catch (error) {
    if (error instanceof Error.CastError) {
      next(createHTTPError(400, 'id format not valid'))
    } else {
      return next(error)
    }
  }
}

/** ======================
 **     Admin controllers
 * =======================**/

// GET :/all-orders/-> Get all users orders
export const getAllOrders = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await allOrders()
    res.status(200).send({ message: 'get all orders', payload: orders })
  } catch (error) {
    next(error)
  }
}

// GET : /user-orders/:id -> returned a specific user orders
export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const order = await userOrders(id)
    res.status(200).send({ message: 'Orders are returned for the user,', payload: order })
  } catch (error) {
    if (error instanceof Error.CastError) {
      next(createHTTPError(400, 'id format not valid'))
    } else {
      return next(error)
    }
  }
}

// GET : /user-order/:id -> returned a specific order
export const getSingleOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const order = await SingleOrder(id)
    res.status(200).send({ message: 'Orders are returned for the user,', payload: order })
  } catch (error) {
    if (error instanceof Error.CastError) {
      next(createHTTPError(400, 'id format not valid'))
    } else {
      return next(error)
    }
  }
}

// PUT :/orders/:id -> update a Orders by id
export const updatedOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const order = req.body

    const updatedOrder = await updateOrder(id, { ...order, status: order.status })
    res.status(200).json({ message: 'Updated order successfully!', payload: updatedOrder })
  } catch (error) {
    if (error instanceof Error.CastError) {
      next(createHTTPError(400, 'id format not valid'))
    } else {
      return next(error)
    }
  }
}

// DELETE :/orders/:id -> delete a Orders by id
export const deleteOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const deletedOrder = await deleteOrder(id)
    res.status(200).json({ message: 'deleted order successfully!', payload: deletedOrder })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(createHTTPError(400, 'id format not valid'))
    } else {
      return next(error)
    }
  }
}
