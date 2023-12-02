/*======= External Dependencies and Modules =======*/
import { Schema, model, Types } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Configurations
import { dev } from '../config'
// Types
import { IProduct } from '../types/productTypes'

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Title cannot be less than 3 characters'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      minlength: [10, 'Description cannot be less than 10 characters'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
      default: 'no description provided',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      default: 0,
      trim: true,
    },
    countInStock: {
      type: Number,
      required: [true, 'Count in stock is required'],
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    category: {
      type: Types.ObjectId,
      ref: 'Category',
      required: true,
      default: dev.app.defaultCategoryId,
    },

    image: {
      type: String,
      default: dev.app.defaultImagePath,
      required: true,
    },
  },
  { timestamps: true }
)

export const Product = model<IProduct>('Product', productSchema)
