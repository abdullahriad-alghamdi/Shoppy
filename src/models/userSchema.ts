/*======= External Dependencies and Modules =======*/
import { Schema, model } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Configuration
import { dev } from '../config'
// Types
import { IUser } from '../types/userTypes'

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'please give the username'],
      trim: true,
      unique: true,
      lowercase: true,
      minlength: [3, 'Name must be at least 3 characters long'],
    },
    name: {
      type: String,
      required: [true, 'please give the name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [300, 'Name must be at most 300 characters '],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'please give the email'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          const emailRegex = /^([\w-\.]+@(([gmail-]{5})+\.)+[\w-]{3})?$/
          return emailRegex.test(value)
        },
        message: 'please give a valid email allowed format :  example@gmail.com',
      },
    },
    password: {
      type: String,
      required: [true, 'please give the password'],
      trim: true,
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    image: {
      type: String,
      default: dev.app.defaultImagePath,
    },

    address: {
      type: String,
      trim: true,
      required: [true, 'please give the address'],
      minlength: [3, 'address must be at least 3 characters long'],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, 'please give the phone number'],
      validate: {
        validator: function (value: string) {
          const phoneRegex = /^(\+966|966|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/
          return phoneRegex.test(value)
        },
        message:
          'please give a valid phone number allowed format :  05xxxxxxxx or +9665xxxxxxxx or 5xxxxxxxx',
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  { timestamps: true }
)

const User = model<IUser>('User', userSchema)
export default User
