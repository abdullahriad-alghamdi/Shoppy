/*======= External Dependencies and Modules =======*/
import { Schema, model } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Types
import { IProduct } from '../types/productTypes'
import { IOrder } from '../types/orderTypes'
import { number, object } from 'joi'

const orderSchema = new Schema<IOrder>(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
{      product:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity:{type:Number,require:true,trim:true}}
    ],
    payment:{type:Object},
    status:{type:String,enum:['Not Processed', 'Processed' ,'Shipped' ,'Delivered' ,'Canceled'] ,default:'Not Processed'}
  },
  { timestamps: true }
)
orderSchema.path('products').validate(function (value: IProduct['_id'][]) {
  return value.length >= 1
}, 'Must have at least one product')

export const Order = model<IOrder>('Order', orderSchema)
