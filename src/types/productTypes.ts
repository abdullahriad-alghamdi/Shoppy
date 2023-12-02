/*======= External Dependencies and Modules =======*/
import { Document, Types } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Types
import { ICategory } from './categoryTypes'

export interface IProduct extends Document {
  _id: string
  title: string
  slug: string
  description: string
  price: number
  quantity: number
  countInStock: number
  sold: number
  image: string
  category: Types.ObjectId | ICategory
  createdAt?: Date
  updatedAt?: Date
  __v: number
}

export type productInputType = Omit<IProduct, 'slug' | 'createdAt' | 'updatedAt' | '__v' | 'sold'>

export type productUpdateType = Partial<productInputType>
