import slugify from "slugify";
import { createHTTPError } from "../utils/createError";
import { IOrder, Order } from "../models/orderSchema";

export const AllOrder = async () => {
  const category = await Order.find();
  return category;
};
export const PostOrder = async (order: IOrder) => {

  const newOrder = new Order(order);
  await newOrder.validate();


  newOrder.save();
  return newOrder;
};
export const GetOneOrder = async (_id: string) => {
  const singleOrder = await Order.findById(_id);
  if (!singleOrder) {
    throw createHTTPError(404, `Order not found with id ${_id}`);
  }
  return singleOrder;
};
export const DeleteOrder = async (id: string) => {
  const deletedOrder = await Order.findByIdAndDelete(id);
  if (!deletedOrder) {
    throw createHTTPError(404, `Order not found with id ${id}`);
  }
  return deletedOrder;
};
export const UpdateOrder = async (id: string, order: IOrder) => {
    console.log(order);

    const orderToValidate = new Order(order);
    await orderToValidate.validate();

  const updatedOrder = await Order.findByIdAndUpdate(
    { _id: id },
    order
    , { new: true}
  );
  if (!updatedOrder) {
    throw createHTTPError(404, `order not found with id ${id}`);
  }
  return updatedOrder;
};
