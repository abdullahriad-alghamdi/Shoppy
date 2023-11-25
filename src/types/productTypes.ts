/*======= External Dependencies and Modules =======*/
import { ICategory } from './categoryTypes'

export interface productType extends Document {
  title: string
  slug: string
  description: string
  price: number
  countInStock: number
  sold: number
  image: string
  category: ICategory['_id']
  createdAt?: Date
  updatedAt?: Date
}

export type productInputType = Omit<productType, 'slug' | 'sold'>

export type productUpdateType = Partial<productInputType> | null

export interface Error {
  message?: string
  statusCode?: number
}
