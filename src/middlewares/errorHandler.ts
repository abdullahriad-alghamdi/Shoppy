/*======= External Dependencies and Modules =======*/
import { Request, Response, NextFunction } from 'express'

/*======= Internal Modules or Files =======*/
// Types
import { Error } from '../types/productTypes'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    message: err.message,
  })
}
