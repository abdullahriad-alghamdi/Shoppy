/*======= External Dependencies and Modules =======*/
import { Request, Response, NextFunction } from 'express'

/*======= Internal Modules or Files =======*/
// Types
import { Error } from '../types/errorType'

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(error.statusCode || 500).json({
    errors: error.message,
  })
}
