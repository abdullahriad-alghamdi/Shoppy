// /*======= Node.js Core Modules =======*/
// import fs from 'fs'

// /*======= External Dependencies and Modules =======*/
// import { NextFunction, Request, Response } from 'express'

// const myLogger = (req: Request, res: Response, next: NextFunction) => {
//   const filePath = './src/logs/requests.txt'
//   const currentDate = new Date()
//   const date = currentDate.toLocaleDateString()
//   const time = currentDate.toLocaleTimeString()

//   const msg = `Method: ${req.method}, Status: ${res.statusCode}, Path: ${req.path}, Date: ${date}, Time: ${time}\n`

//   fs.appendFile(filePath, msg, (error) => {
//     if (error) {
//       return next(new Error('FAILED TO LOG'))
//     }
//     return next()
//   })
// }

// export default myLogger
