/*======= External Dependencies and Modules =======*/
import { Schema, model } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Types
import { ICategory } from '../types/categoryTypes'

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

export const Category = model<ICategory>('Category', categorySchema)
