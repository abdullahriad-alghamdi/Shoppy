import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/product')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.title + '-' + Date.now() + path.extname(file.originalname))
  },
})

export const upload = multer({ storage: storage })
