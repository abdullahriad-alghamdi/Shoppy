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
  getMe,
  updateMe,
} from '../controllers/userControllers'

// Middlewares
import { uploadUserImg } from '../middlewares/uploadFiles'
import { isLoggedOut, isAdmin, isLoggedIn } from '../middlewares/auth'

const router = Router()

/**======================
 **    Users Routes
 *========================**/

// POST : /users/process-register -> Process Registration For New User
router.post('/register', isLoggedOut, uploadUserImg, registerUser)

// POST : /users/activate
router.post('/activate', activateUser)

// GET : /users/me -> Get User By id
router.get('/me', isLoggedIn, getMe)

// PUT : /users/updateMe -> Update User profile By Slug
router.put('/updateMe', isLoggedIn, uploadUserImg, updateMe)

// POST : /users/forgot-password -> Process Forgot Password For User
router.post('/forgot-password', isLoggedOut, forgotPassword)

// POST : /users/reset-password -> Process Reset Password For User
router.post('/reset-password', isLoggedOut, resetPassword)

/**======================
 **    Admin Routes
 *========================**/

// GET : /users -> Get All Users
router.get('/', isLoggedIn, isAdmin, getAllUsers)

// GET : /users/:slug -> Get User By Slug
router.get('/:slug', isLoggedIn, isAdmin, getUserBySlug)

// PUT : /users/:slug -> Update User By Slug
router.put('/:slug', isLoggedIn, isAdmin, uploadUserImg, updateUserBySlug)

// POST : /users -> Create New User
router.post('/', isLoggedIn, isAdmin, uploadUserImg, createUser)

// DELETE : /users/:slug -> Delete User By Slug
router.delete('/:slug', isLoggedIn, isAdmin, deleteUserBySlug)

// POST : /users/ban/:id -> returned Updated user
router.put('/ban/:id', isLoggedIn, isAdmin, banUser)

// POST : /users/ban/:id -> returned Updated user
router.put('/unban/:id', isLoggedIn, isAdmin, unbannedUser)

export default router
