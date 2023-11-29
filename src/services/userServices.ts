/*======= External Dependencies and Modules =======*/
import slugify from 'slugify'
import bcrypt from 'bcrypt'

/*======= Internal Modules or Files =======*/
import User from '../models/userSchema'
// Utils
import { createHTTPError } from '../utils/createError'
// Types
import { IUser, userInputType, userUpdateType } from '../types/userTypes'

// paginating users with a limit of 3 users per page
export const paginateUsers = async (page: number = 1, limit: number = 3, search: string = '') => {
  let skip = Math.max(0, (page - 1) * limit)
  const count = await User.countDocuments()

  const totalPages = Math.ceil(count / limit)

  // if the page is greater than the total pages, set the page to the last page
  if (page > totalPages) {
    page = totalPages
    skip = Math.max(0, (page - 1) * limit)
  }

  let searchQuery: any = {}
  const searchRegExp: RegExp = new RegExp('.*' + search + '.*', 'i')

  if (search) {
    // resting the skip to 0 if the user is searching
    limit = count
    page = 1
    skip = Math.max(0, (page - 1) * limit)
    searchQuery.$or = [{ name: searchRegExp }, { username: searchRegExp }, { email: searchRegExp }]
  }
  const options = {
    password: 0,
  }
  const users = await User.find(searchQuery, options)
    .skip(skip)
    .limit(limit)
    .populate('orders')
    .sort({ createdAt: -1 })

  return { users, totalPages, currentPage: page }
}

// getting a single user by slug
export const findUser = async (slug: string) => {
  const user = await User.findOne({ slug: slug, isAdmin: false })
    .populate('orders')
    .select('-password')
  if (!user) {
    throw createHTTPError(404, `user with slug ${slug} does not exist`)
  }

  return user
}

// creating a user
export const createNewUser = async (user: IUser, imagePath: string | undefined) => {
  const { username, email, password } = user

  const isUserExist = await User.exists({ email: email })
  if (isUserExist) {
    throw createHTTPError(409, `User with email ${email} already exists`)
  }
  if (username) {
    const isUsernameExist = await User.exists({ username: username })
    if (isUsernameExist) {
      throw createHTTPError(409, `User with username ${username} already exists`)
    }
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const slug = username && typeof username === 'string' ? slugify(username, { lower: true }) : ''
  const newUser = await User.create({
    ...user,
    password: hashedPassword,
    slug,
    image: imagePath,
  })

  newUser.save()

  return newUser
}

// updating user by slug
export const updateUser = async (slug: string, user: userUpdateType) => {
  const username = user?.username

  const isUserExist = await User.exists({ slug: slug })
  if (!isUserExist) {
    throw createHTTPError(404, `User with slug ${slug} does not exist`)
  }

  const updatedUser = await User.findOneAndUpdate(
    { slug: slug },
    {
      // update the slug if the username is updated
      ...user,
      slug: username && typeof username === 'string' ? slugify(username, { lower: true }) : slug,
    },
    { new: true }
  )

  return updatedUser
}

// deleting user by slug
export const deleteUser = async (slug: string) => {
  const isUserExist = await User.exists({ slug: slug })
  if (!isUserExist) {
    throw createHTTPError(404, `User with slug ${slug} does not exist`)
  }

  await User.deleteOne({ slug: slug })
}

// Update banning user by id
export const updateBanStatusById = async (id: string, isBanned: boolean) => {
  try {
    const user = await User.findByIdAndUpdate(id, { isBanned }, { new: true })

    if (!user) {
      throw createHTTPError(404, `user not found with ${id}`)
    }
  } catch (error) {
    throw error
  }
}
