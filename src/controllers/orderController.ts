import { NextFunction, Request, Response } from "express";
import { AllOrder, DeleteOrder, GetOneOrder, PostOrder, UpdateOrder } from "../services/OrderService";
import mongoose, { Error } from "mongoose";
import { createHTTPError } from "../utils/createError";

export const PostOrderController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newOrder = await PostOrder(req.body);
  
      res
        .status(201)
        .json({
          message: "Added New Order Successfuly!",
          payload: newOrder,
        });
    } catch (err) {
      if (err instanceof Error.ValidationError){
        // If it's a validation error, extract error messages
        const errorMessages = Object.values(err.errors).map((err) => err.message);
  
        // Send a response with the validation error messages
        res.status(400).json({ errors: errorMessages });

        next(createHTTPError(400,errorMessages.join(', ')))
    } else {
      next(err);
    }
  }}
  export const getAllOrderController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const order = await AllOrder();
      res.status(200).json({
        success: true,
        message: "order ",
        payload: { order },
      });
    } catch (err) {
      next(err);
    }
  };
  export const GetSingleOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newOrder = await GetOneOrder(req.params.id);
  
      res
        .status(200)
        .json({ message: "get Category Successfuly!", payload: newOrder });
    } catch (err) {
      if (err instanceof mongoose.Error.CastError) {
        next(createHTTPError(400, "id format not valid"));
      } else {
        next(err);
      }
    }
  };
  export const DeleteOrderById = async(  req: Request,
    res: Response,
    next: NextFunction)=>{
try{
    const id = req.params.id
    const deletedOrder = await DeleteOrder(id)
    res.status(200).json({message:'deleted order successfully!',payload:deletedOrder})
}catch(error){
    next(error)
}

}
export const UpdatedOrderById = async(  req: Request,
    res: Response,
    next: NextFunction)=>{
try{
    const id = req.params.id
    const order = req.body
    const updatedOrder = await UpdateOrder(id,order)
    res.status(200).json({message:'updated order successfully!',payload:updatedOrder})
}catch(err){
  if (err instanceof Error.ValidationError){
    // If it's a validation error, extract error messages
    const errorMessages = Object.values(err.errors).map((err) => err.message);

    // Send a response with the validation error messages
    res.status(400).json({ errors: errorMessages });

    next(createHTTPError(400,errorMessages.join(', ')))
} else {
  next(err);
}
}

}