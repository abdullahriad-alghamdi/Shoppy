/*======= External Dependencies and Modules =======*/
import { Router } from 'express'

/*======= Internal Modules or Files =======*/
// Controllers
import {
  registerUser,
  activateUser,
  forgotPassword,
  resetPassword,
  createUser,
  deleteUserBySlug,
  getAllUsers,
  getUserBySlug,
  updateUserBySlug,
  banUser,
  unbannedUser,
} from '../controllers/userControllers'

// Middlewares
import { uploadUserImg } from '../middlewares/uploadFiles'
import { isLoggedOut, isAdmin, isLoggedIn } from '../middlewares/auth'

const router = Router()

// GET : /users -> Get All Users
router.get('/', isLoggedIn, isAdmin, getAllUsers)

// GET : /users/:slug -> Get User By Slug
router.get('/:slug', isLoggedIn, getUserBySlug)

// POST : /users -> Create New User
router.post('/', isLoggedIn, isAdmin, uploadUserImg.single('image'), createUser)

// PUT : /users/:slug -> Update User By Slug
router.put('/:slug', updateUserBySlug)

// DELETE : /users/:slug -> Delete User By Slug
router.delete('/:slug', isLoggedIn, isAdmin, deleteUserBySlug)

// POST : /users/process-register -> Process Registration For New User
router.post('/register', uploadUserImg.single('image'), registerUser)

// POST : /users/activate
router.post('/activate', activateUser)

// POST : /users/forgot-password -> Process Forgot Password For User
router.post('/forgot-password', forgotPassword)

// POST : /users/reset-password -> Process Reset Password For User
router.post('/reset-password', resetPassword)

// POST : /users/ban/:id -> returned Updated user
router.put('/ban/:id', isLoggedIn, isAdmin, banUser)

// POST : /users/ban/:id -> returned Updated user
router.put('/unban/:id', isLoggedIn, isAdmin, unbannedUser)

export default router
