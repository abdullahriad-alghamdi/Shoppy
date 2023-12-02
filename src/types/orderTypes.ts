/*======= External Dependencies and Modules =======*/
import { Document } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Types
import { IUser } from '../types/userTypes'
import { IProduct } from '../types/productTypes'
export interface IOrderProduct{
  product: IProduct['_id'],
  quantity:Number
}
export interface IPayment{
  paymentMethod :'Credit Card'| 'Apple Pay'
  amount:number
}
export interface IShipping{
}


export interface IOrder extends Document {
  buyer: IUser['_id']
  products: IOrderProduct[]
  payment:IPayment
  status:'Not Processed'| 'Processed' |'Shipped' | 'Delivered' | 'Canceled'
  // shipping:IShipping
}
