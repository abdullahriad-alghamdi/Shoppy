/*======= Internal Modules or Files =======*/
// Models
import { Order } from '../models/orderSchema'
// Types
import { IOrder } from '../types/orderTypes'
// Utils
import { createHTTPError } from '../utils/createError'


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
