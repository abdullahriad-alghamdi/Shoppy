/*======= External Dependencies and Modules =======*/
import { Document } from 'mongoose'

export interface ICategory extends Document {
  _id: string
  title: string
  slug: string
  createdAt?: Date
  updatedAt?: Date
  __v: number
}
