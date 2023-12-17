/*======= External Dependencies and Modules =======*/
import { Schema, model } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Types
import { IProduct } from '../types/productTypes'
import { IOrder } from '../types/orderTypes'

const orderSchema = new Schema<IOrder>(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          trim: true,
        },
      },
    ],

    payment: { type: Object },

    status: {
      type: String,
      enum: ['Pending', 'Processed', 'Shipped', 'Delivered', 'Canceled'],
      default: 'Pending',
    },
    shipping: {
      address: { type: String, require: true, trim: true },
      city: { type: String, require: true, trim: true },
      postalCode: { type: String, require: true, trim: true },
      country: { type: String, require: true, trim: true },
    },
  },
  { timestamps: true }
)
orderSchema.path('products').validate(function (value: IProduct['_id'][]) {
  return value.length >= 1
}, 'Must have at least one product')

export const Order = model<IOrder>('Order', orderSchema)
