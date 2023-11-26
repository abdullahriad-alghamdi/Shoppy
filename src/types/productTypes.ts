/*======= External Dependencies and Modules =======*/
import { Document } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Types
import { ICategory } from './categoryTypes'

export interface IProduct extends Document {
  _id: string
  title: string
  slug: string
  description: string
  price: number
  countInStock: number
  sold: number
  image: string
  categories: ICategory['_id'][]
  createdAt?: Date
  updatedAt?: Date
  __v: number
}

export type productInputType = Omit<IProduct, 'slug' | 'sold'>

export type productUpdateType = Partial<productInputType> | null

export interface Error {
  message?: string
  statusCode?: number
}
