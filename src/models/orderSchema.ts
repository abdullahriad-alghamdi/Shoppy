/*======= External Dependencies and Modules =======*/
import { Schema, model } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Types
import { IProduct } from '../types/productTypes'
import { IOrder } from '../types/orderTypes'

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
  },
  { timestamps: true }
)
orderSchema.path('products').validate(function (value: IProduct['_id'][]) {
  return value.length >= 1
}, 'Must have at least one product')

export const Order = model<IOrder>('Order', orderSchema)
