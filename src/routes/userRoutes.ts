/*======= External Dependencies and Modules =======*/
import { Router } from 'express'

/*======= Internal Modules or Files =======*/
// Controllers
import {
  activateUser,
  processRegisterUser,
  processResetPassword,
  resetPassword,
} from '../controllers/userControllers'
// Middlewares
import { uploadUserImg } from '../middlewares/uploadFiles'

const router = Router()

// GET : /users -> Get All Users

// GET : /users/:id -> Get User By Id

// POST : /users/process-register -> Process Registration For New User
router.post('/process-register', uploadUserImg.single('image'), processRegisterUser)

// POST : /users/activate
router.post('/activate', activateUser)

// POST : /users/forgot-password -> Process Forgot Password For User
router.post('/forgot-password', processResetPassword)

// POST : /users/reset-password -> Process Reset Password For User
router.post('/reset-password', resetPassword)
// POST : /users/login -> Process Login For User

// PUT : /users/:id -> Update User By Id

// DELETE : /users/:id -> Delete User By Id

export default router
