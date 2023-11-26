/*======= External Dependencies and Modules =======*/
import { Document } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Types
import { IUser } from '../types/userTypes'
import { IProduct } from '../types/productTypes'

export interface IOrder extends Document {
  _id: string
  user: IUser['_id']
  Products: IProduct['_id'][]
  createdAt?: Date
  updatedAt?: Date
  __v: number
}
