// External Dependencies and Modules
import { Schema, model } from 'mongoose'

// Internal Modules or Files
import { ICategory } from '../types/productTypes'

const categorySchema = new Schema(
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
export const Category = model<ICategory>('Category', categorySchema)
