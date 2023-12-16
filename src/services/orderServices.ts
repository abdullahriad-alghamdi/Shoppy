/*======= Internal Modules or Files =======*/
// Models
import { Order } from '../models/orderSchema'
// Types
import { IOrder } from '../types/orderTypes'
// Utils
import { createHTTPError } from '../utils/createError'

// get all orders
export const allOrders = async () => {
  const orders = await Order.find()
    .populate('buyer', 'name address phone -_id ')
    .populate({ path: 'products', populate: { path: 'product', select: 'title price' } })
  return orders
}

// get single order
export const singleOrder = async (user_id: string) => {
  //can use query for id cause user already logged in or pass id for admin
  // const user_id = req.user_id
  const order = await Order.find({ buyer: user_id })
    .populate('buyer', 'name address phone -_id')
    .populate({ path: 'products', populate: { path: 'product', select: 'title price' } })
  if (!order) {
    throw createHTTPError(404, `Order with user: ${user_id} does not exist`)
  }
  return order
}

// Create order
export const saveOrder = async (order: IOrder, userId: string) => {
  const newOrder = new Order({
    products: order.products,
    payment: order.payment,
    buyer: userId,
  })

  await newOrder.save()
  return newOrder
}

// update order
export const updateOrder = async (id: string, order: IOrder) => {
  const orderToValidate = new Order(order)
  await orderToValidate.validate()

  const updatedOrder = await Order.findByIdAndUpdate({ _id: id }, order, { new: true })
  if (!updatedOrder) {
    throw createHTTPError(404, `order not found with id ${id}`)
  }
  return updatedOrder
}

// delete order
export const deleteOrder = async (id: string) => {
  const deletedOrder = await Order.findByIdAndDelete(id)
  if (!deletedOrder) {
    throw createHTTPError(404, `Order not found with id ${id}`)
  }
  return deletedOrder
}
