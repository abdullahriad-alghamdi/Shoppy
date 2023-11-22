/*======= External Dependencies and Modules =======*/
import { Document } from 'mongoose'

export interface ICategory extends Document {
  _id: string
  title: string
  slug: string
  createdAt: string
  updatedAt: string
  __v: number
}
