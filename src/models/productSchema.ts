import { Schema, model } from 'mongoose'

import { productType } from '../types/productTypes'

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
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
      required: true,
      trim: true,
      minlength: [10, 'Description cannot be less than 10 characters'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      trim: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    image: {
      type: String,
      default: '../public/images/product/default.png',
    },
  },
  { timestamps: true }
)

export default model<productType>('Product', productSchema)
