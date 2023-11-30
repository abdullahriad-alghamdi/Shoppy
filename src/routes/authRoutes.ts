/*======= External Dependencies and Modules =======*/
import { Router } from 'express'
/*======= Internal Modules or Files =======*/
// Controllers
import { loginUser, logoutUser } from '../controllers/authController'
// Middlewares
import { isLoggedOut, isLoggedIn } from '../middlewares/auth'

const router = Router()

// POST : /auth/login -> Login User
router.post('/login', isLoggedOut, loginUser)
// POST : /auth/logout -> Logout User
router.post('/logout', isLoggedIn, logoutUser)

export default router
