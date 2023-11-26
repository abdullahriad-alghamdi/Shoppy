/*======= External Dependencies and Modules =======*/
import { Document } from 'mongoose'
import { IOrder } from './orderTypes'

export interface IUser extends Document {
  name: string
  slug: string
  email: string
  password: string
  image: string
  address: string
  phone: string
  isAdmin: boolean
  isBanned: boolean
  // orders?: IOrder['_id'][]
  createdAt?: Date
  updatedAt?: Date
  __v: number
}

// export interface IUserInputDTO {
//   name: string
//   email: string
//   password: string
//   image: string
//   address: string
//   phone: string
// }

export type EmailDataType = {
  email: string
  subject: string
  html: string
}
