/*======= Internal Modules or Files =======*/
import fs from 'fs'
/*======= External Dependencies and Modules =======*/
import slugify from 'slugify'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

/*======= Internal Modules or Files =======*/
import User from '../models/userSchema'
// Utils
import { createHTTPError } from '../utils/createError'
// Types
import { IUser, userUpdateProfileType, userUpdateType } from '../types/userTypes'
// Configuration
import { dev } from '../config'
// Helpers
import { createJSONWebToken, verifyJSONWebToken } from '../helper/jwtHelper'

// paginating users with a limit of 3 users per page
export const getUsers = async (
  page: number = 1,
  limit: number = 3,
  search: string = '',
  sort: string = 'desc'
) => {
  let skip = Math.max(0, (page - 1) * limit)
  const count = await User.countDocuments()
  const sortBy = sort === 'asc' ? 1 : sort === 'desc' ? -1 : -1

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
    searchQuery.$or = [
      { name: searchRegExp },
      { username: searchRegExp },
      { email: searchRegExp },
      { phone: searchRegExp },
      { address: searchRegExp },
    ]
  }
  const filter = {
    password: 0,
    __v: 0,
  }
  const users = await User.find(searchQuery, filter)
    .skip(skip)
    .limit(limit)
    .populate('orders')
    .sort({ createdAt: sortBy })

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
  const hashedPassword = password && (await bcrypt.hash(password, 10))
  const slug =
    username && typeof username === 'string' ? slugify(username, { lower: true }) : username

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
export const updateUser = async (
  slug: string,
  user: userUpdateType,
  imagePath: string | undefined
) => {
  const { username, email, password, image } = user

  const isUserExist = await User.exists({ slug: slug })
  if (!isUserExist) {
    throw createHTTPError(404, `User with slug ${slug} does not exist`)
  }

  const isEmailExist = await User.exists({ email: email })
  if (isEmailExist) {
    throw createHTTPError(409, `User with email ${email} already exists`)
  }
  if (username) {
    const isUsernameExist = await User.exists({ username: username })
    if (isUsernameExist) {
      throw createHTTPError(409, `User with username ${username} already exists`)
    }
  }

  const hashedPassword = password && (await bcrypt.hash(password, 10))
  const updatedUser = await User.findOneAndUpdate(
    { slug: slug },
    {
      ...user,
      password: hashedPassword,
      image: imagePath,
      slug:
        username && typeof username === 'string' ? slugify(username, { lower: true }) : username,
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
    // check if user with id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId')
    }
    const user = await User.findByIdAndUpdate(id, { isBanned }, { new: true })

    if (!user) {
      throw createHTTPError(404, `user not found with ${id}`)
    }
  } catch (error) {
    throw error
  }
}

// update User Profile

export const updateUserProfile = async (
  id: string | undefined,
  user: userUpdateProfileType,
  imagePath: string | undefined
) => {
  try {
    // check if user exist

    const isUserExist = await User.exists({ _id: id })

    if (!isUserExist) {
      throw createHTTPError(404, `User with id ${id} does not exist`)
    }

    const { username, email, password } = user

    const isEmailExist = await User.exists({ email: email })

    if (isEmailExist) {
      throw createHTTPError(409, `User with email ${email} already exists`)
    }

    const hashedPassword = password && (await bcrypt.hash(password, 10))

    let slug =
      username && typeof username === 'string' ? slugify(username, { lower: true }) : username

    // update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...user,
        password: hashedPassword,
        slug,
        image: imagePath,
      },
      { new: true }
    )

    return updatedUser
  } catch (error) {
    throw error
  }
}

// activate user
export const activatingUser = async (token: string) => {
  try {
    if (!token) {
      throw createHTTPError(404, 'Please provide a token')
    }

    const decoded = verifyJSONWebToken(token, dev.app.jwtUserActivationKey)
    if (!decoded) {
      throw createHTTPError(404, 'Invalid token')
    }
    if (typeof decoded === 'object' && 'email' in decoded) {
      const isUserExists = await User.exists({ email: decoded.email })

      if (isUserExists) {
        throw createHTTPError(409, 'User already exists')
      }
      await User.create(decoded)
    } else {
      throw createHTTPError(404, 'Invalid token')
    }
    return decoded
  } catch (error) {
    throw error
  }
}
