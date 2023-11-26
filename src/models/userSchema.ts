/*======= External Dependencies and Modules =======*/
import { Schema, model } from 'mongoose'

/*======= Internal Modules or Files =======*/
// Configuration
import { dev } from '../config'
// Types
import { IUser } from '../types/userTypes'

const userSchema = new Schema<IUser>(
  {
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
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
        },
        message: 'please enter a valid email address',
      },
    },
    password: {
      type: String,
      required: [true, 'please give the password'],
      trim: true,
      minlength: [6, 'Name must be at least 6 characters long'],
      //set: (password: string) => bcrypt.hashSync(password, 10),
    },
    image: {
      type: String,
      default: dev.app.defaultImagePath,
    },

    address: {
      type: String,
      trim: true,
      required: [true, 'please give the address'],
      minlength: [3, 'Name must be at least 3 characters long'],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, 'please give the phone number'],
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
