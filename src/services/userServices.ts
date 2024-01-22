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
import {
  deleteFromCloudinary,
  uploadToCloudinary,
  valueWithoutExtension,
} from '../helper/cloudinary'

// paginating users with a limit of 3 users per page
export const getUsers = async (
  page: number = 1,
  limit: number = 555, //TODO: change this to 3
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
  const user = await User.findOne({ slug: slug }).populate('orders').select('-password')
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

  if (newUser && newUser.image) {
    const cloudinaryUrl = await uploadToCloudinary(newUser.image, `sda-ecommerce/users`)
    // adding the cloudinary url to
    newUser.image = cloudinaryUrl
    await newUser.save()
  }

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

  // to upload an image to Cloudinary and get the Cloudinary URL
  if (updatedUser && updatedUser.image) {
    const cloudinaryUrl = await uploadToCloudinary(updatedUser.image, `sda-ecommerce/users`)
    // adding the cloudinary url to
    updatedUser.image = cloudinaryUrl
    await updatedUser.save()
  }

  const oldUserValues = await User.findOne({ slug: slug })
  // if the user has image then delete image from cloudinary
  if (oldUserValues && oldUserValues.image) {
    const publicId = await valueWithoutExtension(oldUserValues.image)
    await deleteFromCloudinary(`sda-ecommerce/users/${publicId}`)
  }

  return updatedUser
}

// deleting user by slug
export const deleteUser = async (slug: string) => {
  const isUserExist = await User.exists({ slug: slug })
  if (!isUserExist) {
    throw createHTTPError(404, `User with slug ${slug} does not exist`)
  }
  // delete user image
  const user = await User.findOne({ slug: slug })
  if (user && user.image) {
    const publicId = await valueWithoutExtension(user.image)
    await deleteFromCloudinary(`sda-ecommerce/users/${publicId}`)
  }

  // delete user
  await User.deleteOne({ slug: slug })
}

// update banning user by id
export const updateBanStatusById = async (id: string) => {
  const user = await User.findById(id)
  if (!user) {
    throw new Error('User not found')
  }

  const isBanned = !user.isBanned
  await User.findByIdAndUpdate(id, { isBanned }, { new: true })

  return isBanned
}

// // update User Profile
// export const updateUserProfile = async (
//   id: string | undefined,
//   user: userUpdateProfileType,
//   imagePath: string | undefined
// ) => {
//   try {
//     // check if user exist

//     const isUserExist = await User.exists({ _id: id })

//     if (!isUserExist) {
//       throw createHTTPError(404, `User with id ${id} does not exist`)
//     }

//     const { username, email, password } = user

//     const isEmailExist = await User.exists({ email: email })

//     if (isEmailExist) {
//       throw createHTTPError(409, `User with email ${email} already exists`)
//     }

//     const hashedPassword = password && (await bcrypt.hash(password, 10))

//     let slug =
//       username && typeof username === 'string' ? slugify(username, { lower: true }) : username

//     // update user
//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       {
//         ...user,
//         password: hashedPassword,
//         slug,
//         image: imagePath,
//       },
//       { new: true }
//     )

//     return updatedUser
//   } catch (error) {
//     throw error
//   }
// }

// register user
export const registeringUser = async (user: IUser, imagePath: string | undefined) => {
  try {
    const { username, name, email, password, address, phone } = user

    const isUserExists = await User.exists({ email: email })

    if (isUserExists) {
      throw createHTTPError(409, 'User already exists')
    }

    const hashedPassword = password && (await bcrypt.hash(password, 10))

    const tokenPayload = {
      username,
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      phone: phone,
      image: imagePath
        ? imagePath
        : 'https://res.cloudinary.com/dasw4jtcc/image/upload/v1703635374/sda-ecommerce/users/tma6srugpghvqhjesbyt.png',
      slug:
        username && typeof username === 'string'
          ? slugify(username, { lower: true })
          : slugify(name, { lower: true }),
    }
    // to upload an image to Cloudinary and get the Cloudinary URL
    const cloudinaryUrl = await uploadToCloudinary(tokenPayload.image!, 'sda-ecommerce/products')

    // adding the cloudinary url to
    tokenPayload.image = cloudinaryUrl

    // create token
    const token = createJSONWebToken(tokenPayload, dev.app.jwtKey, '10m')

    // create email data with url and token
    const emailData = {
      email: email,
      subject: 'Account activation link',
      html: `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; text-align: center; background-color: #f0f9f0;">
      <div style="max-width: 600px; margin: 50px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <img src="https://res.cloudinary.com/dasw4jtcc/image/upload/v1703519214/time.png" alt="Activation Image" style="margin-bottom: 5px; width: 300px; height: 200px; object-fit: contain">
        <h1 style="color: #007f7f; font-size: 28px; font-weight: bold; margin-bottom: 20px;">Activate your email</h1>
        <p style="font-size: 18px; margin-bottom: 30px;">Please click on the link below to activate your email</p>
        <a href="${dev.corsOrigin}/activate/${token}" style="display: inline-block; padding: 12px 24px; background-color: #007f7f; color: #ffffff; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 5px; transition: background-color 0.3s ease;" class="activation-link">Activate</a>
      </div>
    </body>`,
    }

    return { emailData }
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

    const decoded = verifyJSONWebToken(token, dev.app.jwtKey)
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

// forgot password
export const resetMyPasswordProcess = async (email: string) => {
  try {
    const isUserExists = await User.exists({ email: email })

    if (!isUserExists) {
      throw createHTTPError(404, 'User does not exist')
    }

    const tokenPayload = {
      email: email,
    }

    // create token
    const token = createJSONWebToken(tokenPayload, dev.app.jwtKey, '10m')

    // create email data with url and token
    const emailData = {
      email: email,
      subject: 'Password reset link',
      html: `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; text-align: center; background-color: #f0f9f0;">
      <div style="max-width: 600px; margin: 50px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <div style="max-width: 400px; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #007f7f; font-size: 28px; font-weight: bold; margin-bottom: 20px;">Reset Your Password</h1>
          <p style="font-size: 16px; margin-bottom: 30px;">Please click the button below to reset your password.</p>
          <a href=${dev.corsOrigin}/resetPassword/${token}" style="display: inline-block; padding: 12px 24px; background-color: #007f7f; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px; transition: background-color 0.3s ease;">Reset Password</a>
          <p style="font-size: 14px; color: #888; margin-top: 20px;">If you did not request this, please ignore this email.</p>
        </div>
      </div>
    </body>`,
    }

    return { emailData, token }
  } catch (error) {
    throw error
  }
}

// reset password
export const resetThePassword = async (token: string, password: string) => {
  try {
    if (!token) {
      throw createHTTPError(404, 'Please provide a token')
    }

    const decoded = verifyJSONWebToken(token, dev.app.jwtKey)
    if (!decoded) {
      throw createHTTPError(404, 'Invalid token')
    }

    if (typeof decoded === 'object' && 'email' in decoded) {
      const isUserExists = await User.exists({ email: decoded.email })

      if (!isUserExists) {
        throw createHTTPError(404, 'User does not exist')
      }
      const hashedPassword = password && (await bcrypt.hash(password, 10))
      await User.findOneAndUpdate({ email: decoded.email }, { password: hashedPassword })
    } else {
      throw createHTTPError(404, 'Invalid token')
    }
    return decoded
  } catch (error) {
    throw error
  }
}

// update user info
export const updateUserProfile = async (
  id: string,
  data: { email: string; name: string; password: string }
) => {
  try {
    const { email, name, password } = data

    const isUserExists = await User.exists({ _id: id })

    if (!isUserExists) {
      throw createHTTPError(404, 'User does not exist')
    }

    const hashedPassword = password && (await bcrypt.hash(password, 10))
    const oldUserValues = await User.findOne({ _id: id })

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        email: email ? email : oldUserValues?.email,
        name: name ? name : oldUserValues?.name,
        password: hashedPassword ? hashedPassword : oldUserValues?.password,
      },
      { new: true }
    )

    return updatedUser
  } catch (error) {
    throw error
  }
}
