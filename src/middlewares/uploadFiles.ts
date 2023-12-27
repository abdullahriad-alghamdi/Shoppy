/*======= Node.js Core Modules =======*/
import path from 'path'

/*======= External Dependencies and Modules =======*/
import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'

// this is a storage for product image
const productStorage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, 'public/images/products')
  // },
  filename: function (req, file, cb) {
    cb(null, req.body.title + '-' + Date.now() + path.extname(file.originalname))
  },
})

// this is a storage for user profile image
const userStorage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, 'public/images/users')
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

// this is a file filter for specific file type
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedType = ['image/jpg', 'image/png', 'image/jpeg']
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Please upload only image file'))
  }
  if (!allowedType.includes(file.mimetype)) {
    return cb(new Error('Please upload only jpg, png or jpeg file'))
  }
  cb(null, true)
}

// this is a multer middlewares for uploading image
export const uploadProductImg = multer({
  storage: productStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
}).single('image')

export const uploadUserImg = multer({
  storage: userStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
}).single('image')
