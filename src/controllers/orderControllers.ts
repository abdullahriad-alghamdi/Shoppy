/*======= External Dependencies and Modules =======*/
import { NextFunction, Request, Response } from 'express'
import mongoose, { Error } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Services
import {
  updateOrder,
  deleteOrder,
  saveOrder,
  singleOrder,
  allOrders,
} from '../services/orderServices'
// Utils
import { createHTTPError } from '../utils/createError'
import { CustomRequest } from '../types/userTypes'

/**======================
 **      user controllers
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

// GET :/orders/:id -> get user order
export const getOrderForUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user_id = req.params.id
    const order = await singleOrder(user_id)
    res.status(200).send({ message: 'Orders are returned for the user,', payload: order })
  } catch (error) {
    next(error)
  }
}

/** ======================
 **     Admin controllers
 * =======================**/

// GET :/orders/:id -> Get all orders
export const getOrdersAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await allOrders()
    res.status(200).send({ message: 'get all orders', payload: orders })
  } catch (error) {
    next(error)
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
