/*======= External Dependencies and Modules =======*/
import { Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  image: string
  address: string
  phone: string
  isAdmin: boolean
  isBanned: boolean
}

export type EmailDataType = {
  email: string
  subject: string
  html: string
}
