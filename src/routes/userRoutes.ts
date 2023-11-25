/*======= External Dependencies and Modules =======*/
import { Router } from 'express'

/*======= Internal Modules or Files =======*/
// Controllers
import { activateUser, processRegisterUser } from '../controllers/userController'
// Middlewares
import { uploadUserImg } from '../middlewares/uploadFile'

const router = Router()

// POST : /users/process-register -> Process Registration For New User
router.post('/process-register', uploadUserImg.single('image'), processRegisterUser)

// POST : /users/activate
router.post('/activate', activateUser)

export default router
