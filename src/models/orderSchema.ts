import { Document } from "mongodb";
import { Schema, model } from "mongoose";
import { IUser } from '../types/userTypes'
import { productType } from '../types/productTypes'

export interface IOrder extends Document {
  _id: string
  user: IUser['_id']
  Products: productType['_id'][]
  createdAt: string
  updatedAt: string
  __v: number
}

const OrderSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    }],
  },
  { timestamps: true }
);
OrderSchema.path('products').validate(function (value: productType['_id'][]) {
    return value.length >= 1;
  }, 'Must have at least one product');

//model/collection
export const Order = model<IOrder>("Order", OrderSchema);
