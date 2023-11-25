/*======= External Dependencies and Modules =======*/
import { Router } from 'express'

/*======= Internal Modules or Files =======*/
// Controllers
import { activateUser, processRegisterUser } from '../controllers/userController'
// Middlewares
import { uploadUserImg } from '../middlewares/uploadFile'

const router = Router()

// GET : /users -> Get All Users

// GET : /users/:id -> Get User By Id

// POST : /users/process-register -> Process Registration For New User
router.post('/process-register', uploadUserImg.single('image'), processRegisterUser)

// POST : /users/activate
router.post('/activate', activateUser)

// POST : /users/login -> Process Login For User

// PUT : /users/:id -> Update User By Id

// DELETE : /users/:id -> Delete User By Id

export default router
