/*======= External Dependencies and Modules =======*/
import { Router } from 'express'
/*======= Internal Modules or Files =======*/
// Controllers
import { loginUser, logoutUser } from '../controllers/authController'

const router = Router()

// POST : /auth/login -> Login User
router.post('/login', loginUser)
router.post('/logout', logoutUser)

export default router
