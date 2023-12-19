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
  // banUser,
  // unbannedUser,
  getMe,
  updateMe,
  updateUserRole,
  updateUserBannedStatus,
} from '../controllers/userControllers'

// Middlewares
import { uploadUserImg } from '../middlewares/uploadFiles'
import { isLoggedOut, isAdmin, isLoggedIn } from '../middlewares/auth'
import { adminValidate, userValidate } from '../middlewares/validation'

const router = Router()

// /**======================
//  **    Users Routes
//  *=======================**/

// // POST : /users/process-register -> Process Registration For New User
// router.post('/register', isLoggedOut, uploadUserImg, userValidate, registerUser)

// // POST : /users/activate
// router.post('/activate', activateUser)

// /**======================
//  **    Admin Routes
//  *=======================**/

// // GET : /users -> Get All Users
// router.get('/', isLoggedIn, isAdmin, getAllUsers)

// // GET : /users/:slug -> Get User By Slug
// router.get('/:slug', isLoggedIn, isAdmin, getUserBySlug)

// // PUT : /users/:slug -> Update User By Slug
// router.put('/:slug', isLoggedIn, isAdmin, uploadUserImg, updateUserBySlug)

// // POST : /users -> Create New User
// router.post('/', uploadUserImg, adminValidate, createUser)

// // DELETE : /users/:slug -> Delete User By Slug
// router.delete('/:slug', isLoggedIn, isAdmin, deleteUserBySlug)

// // PUT : /users/banStatus/:id -> update User Banned Status
// router.put('/banStatus/:id',isLoggedIn, isAdmin, updateUserBannedStatus)

// // Put : /users/role/:id -> update user role
// router.put('/role/:id', isLoggedIn, isAdmin, updateUserRole)

// /**======================
//  **    All Routes
//  *=======================**/

// // GET : /users/me -> Get User By id
// router.get('/me', isLoggedIn, getMe)

// // PUT : /users/updateMe -> Update User profile By Slug
// router.put('/updateMe', isLoggedIn, uploadUserImg, updateMe)

// // POST : /users/forgot-password -> Process Forgot Password For User
// router.post('/forgot-password', isLoggedOut, forgotPassword)

// // POST : /users/reset-password -> Process Reset Password For User
// router.post('/reset-password', isLoggedOut, resetPassword)

/**======================
 **    Users Routes
 *=======================**/

// POST : /users/process-register -> Process Registration For New User
router.post('/register', uploadUserImg, userValidate, registerUser)

// POST : /users/activate
router.post('/activate', activateUser)

/**======================
 **    Admin Routes
 *=======================**/

// GET : /users -> Get All Users
router.get('/', getAllUsers)

// GET : /users/:slug -> Get User By Slug
router.get('/:slug', getUserBySlug)

// PUT : /users/:slug -> Update User By Slug
router.put('/:slug', isLoggedIn, isAdmin, uploadUserImg, updateUserBySlug)

// POST : /users -> Create New User
router.post('/', uploadUserImg, adminValidate, createUser)

// DELETE : /users/:slug -> Delete User By Slug
router.delete('/:slug', deleteUserBySlug)

// PUT : /users/banStatus/:id -> update User Banned Status
router.put('/banStatus/:id', updateUserBannedStatus)

// Put : /users/role/:id -> update user role
router.put('/role/:id', updateUserRole)

/**======================
 **    All Routes
 *=======================**/

// GET : /users/me -> Get User By id
router.get('/me', isLoggedIn, getMe)

// PUT : /users/updateMe -> Update User profile By Slug
router.put('/updateMe', isLoggedIn, uploadUserImg, updateMe)

// POST : /users/forgot-password -> Process Forgot Password For User
router.post('/forgot-password', forgotPassword)

// POST : /users/reset-password -> Process Reset Password For User
router.post('/reset-password', resetPassword)

export default router
