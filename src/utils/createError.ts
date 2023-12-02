/*======= Internal Modules or Files =======*/
import { Error } from '../types/errorType'

export const createHTTPError = (status: number, message: string | {}) => {
  const error: Error = new Error()

  error.statusCode = status
  error.message = message

  return error
}
