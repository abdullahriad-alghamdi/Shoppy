/*======= External Dependencies and Modules =======*/
import { Document } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Types
import { IUser } from '../types/userTypes'
import { IProduct } from '../types/productTypes'

export interface IOrderProduct {
  product: IProduct['_id']
  quantity: Number
}
export interface IPayment {
  paymentMethod: 'Credit Card' | 'Apple Pay'
  amount: number
}
export interface IShipping {
  address: string
  city: string
  postalCode: string
  country: string
}

export interface IOrder extends Document {
  buyer: IUser['_id']
  products: IOrderProduct[]
  payment: IPayment
  status: 'Pending' | 'Processed' | 'Shipped' | 'Delivered' | 'Canceled'
  totalPrice: number
  shipping: IShipping
}

export type orderInputType = Omit<IOrder, 'buyer'>
export type orderUpdateType = Partial<orderInputType>
