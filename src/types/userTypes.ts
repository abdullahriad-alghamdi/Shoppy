/*======= External Dependencies and Modules =======*/
import { Document } from 'mongoose'
import { Request } from 'express'

/*======= Internal Modules or Files =======*/
// Types
import { IOrder } from './orderTypes'

export interface IUser extends Document {
  name: string
  username: string
  slug: string
  email: string
  password: string
  image?: string
  orders: IOrder['user'][]
  address: string
  phone: string
  isAdmin: boolean
  isBanned: boolean
  createdAt?: Date
  updatedAt?: Date
  __v: number
}

// For admin
export type userInputType = Omit<IUser, '_id' | 'slug' | 'createdAt' | 'updatedAt' | '__v'>

export type userUpdateType = Partial<userInputType>

// For user Profile
export type userInputProfileType = Omit<
  IUser,
  'slug' | 'createdAt' | 'updatedAt' | '__v' | 'isAdmin' | 'isBanned'
>
export type userUpdateProfileType = Partial<userInputProfileType>

// For activation email
export type EmailDataType = {
  email: string
  subject: string
  html: string
}

// For user isLoggedIn
export interface CustomRequest extends Request {
  user_id?: string
}
