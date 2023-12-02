/*======= External Dependencies and Modules =======*/
import { NextFunction, Request, Response } from 'express'
import mongoose, { Error } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Services
import {
  updateOrder,
  deleteOrder,
} from '../services/orderServices'
// Utils
import { createHTTPError } from '../utils/createError'
import { Order } from '../models/orderSchema'
import { CustomRequest } from '../types/userTypes'
import { IOrderProduct } from '../types/orderTypes'

/**======================
 **      user controllers
 *========================**/
// POST :/orders/process-payment -> add new user order
export const handlePayment = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const  order  = req.body

    const newOrder = new Order({
      products: order.products,
      payment: order.payment,
      buyer: req.user_id,
    })
    //Update sold value
    // total

    await newOrder.save()
    res.status(201).send({ message: 'Payment was successfully and order was created',payload: newOrder})
  } catch (error) {
    next(error)
  }
}
// GET :/orders/:id -> get user order
export const getOrderForUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    //can use query for id cause user already logged in or pass id for admin
    const user_id = req.params.id
    // const user_id = req.user_id
    const order = await Order.find({ buyer: user_id })
      .populate('buyer', 'name address phone -_id')
      .populate({ path: 'products', populate: { path: 'product', select: 'title price' } })

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
    const orders = await Order.find()
      .populate('buyer', 'name address phone -_id ')
      .populate({ path: 'products', populate: { path: 'product', select: 'title price' } })
    res.status(200).send({ message: 'get all orders',payload:orders })
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


