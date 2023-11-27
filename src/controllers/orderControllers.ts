/*======= External Dependencies and Modules =======*/
import { NextFunction, Request, Response } from 'express'
import mongoose, { Error } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Services
import {
  getOrders,
  findOrder,
  createNewOrder,
  updateOrder,
  deleteOrder,
} from '../services/orderServices'
// Utils
import { createHTTPError } from '../utils/createError'

// GET : /orders -> returned all Orders
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await getOrders()
    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      payload: orders,
    })
  } catch (error) {
    next(error)
  }
}

// GET :/orders/:id-> returned single Orders
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const newOrder = await findOrder(id)

    res.status(200).json({ message: 'Get Category Successfully!', payload: newOrder })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(createHTTPError(400, 'id format not valid'))
    } else {
      next(error)
    }
  }
}

// POST :/orders/-> Create new Orders
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newOrder = await createNewOrder(req.body)

    res.status(201).json({
      message: 'Added New Order Successfully!',
      payload: newOrder,
    })
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      const errorMessages = Object.values(error.errors).map((error) => error.message)
      res.status(400).json({ errors: errorMessages })
      next(createHTTPError(400, errorMessages.join(', ')))
    } else {
      next(error)
    }
  }
}

// PUT :/orders/:id -> update a Orders by id
export const updatedOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const order = req.body
    const updatedOrder = await updateOrder(id, order)
    res.status(200).json({ message: 'Updated order successfully!', payload: updatedOrder })
  } catch (error) {
    if (error instanceof Error.CastError) {
      next(createHTTPError(400, 'id format not valid'))
    } else {
      next(error)
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
      next(error)
    }
  }
}
