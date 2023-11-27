/*======= External Dependencies and Modules =======*/
import { Router } from 'express'
/*======= Internal Modules or Files =======*/
// Controllers
import { loginUser } from '../controllers/authController'

const router = Router()

// POST : /auth/login -> Login User
router.post('/login', loginUser)

export default router
