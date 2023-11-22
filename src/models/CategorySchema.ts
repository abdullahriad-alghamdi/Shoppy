import { Document } from 'mongodb'
import { Schema, model } from 'mongoose'

export interface ICategory extends Document {
  _id: string
  title: string
  slug: string
  createdAt: string
  updatedAt: string
  __v: number
}

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, 'Category title must be at least 3 characters long'],
      maxlength: [100, 'Category title must be at least 3 characters long'],
    },
    slug: {
      type: String,
      unique: true,
      minlength: [3, 'Category title must be at least 3 characters long'],
    },
  },
  { timestamps: true }
)

//model/collection
export const Category = model<ICategory>('Category', CategorySchema)
