/*======= Node.js Core Modules =======*/
import path from 'path'

/*======= External Dependencies and Modules =======*/
import multer from 'multer'

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/products')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.title + '-' + Date.now() + path.extname(file.originalname))
  },
})

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/users')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

export const uploadProductImg = multer({ storage: productStorage })
export const uploadUserImg = multer({ storage: userStorage })
