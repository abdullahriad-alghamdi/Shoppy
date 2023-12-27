/*======= External Dependencies and Modules =======*/
import slugify from 'slugify'

/*======= Internal Modules or Files =======*/
// Models
import { Category } from '../models/categorySchema'
// Utils
import { createHTTPError } from '../utils/createError'

// getting all Category
export const getCategories = async (search: string = '', sort: string = 'desc') => {
  const sortBy = sort === 'asc' ? 1 : sort === 'desc' ? -1 : -1

  let searchQuery: any = {}
  const searchRegExp: RegExp = new RegExp('.*' + search + '.*', 'i')

  if (search) {
    searchQuery.$or = [{ title: searchRegExp }]
  }
  const filter = {
    __v: 0,
  }

  const categories = await Category.find(searchQuery, filter).sort({ createdAt: sortBy })

  return { categories }
}

// finding a single Category by slug
export const findCategory = async (slug: string) => {
  const category = await Category.findOne({ slug: slug })
  if (!category) {
    throw createHTTPError(404, `Category with slug ${slug} does not exist`)
  }
  return category
}

// creating new Category
export const createNewCategory = async (title: string) => {
  const isCategoryExist = await Category.exists({ title: title })
  if (isCategoryExist) {
    throw createHTTPError(409, 'Category already exist')
  }
  const newCategory = new Category({
    title: title,
    slug: slugify(title, { lower: true }),
  })
  await newCategory.save()
  return newCategory
}

// updating a Category by slug
export const updateCategory = async (slug: string, title: string) => {
  const isCategoryExist = await Category.exists({ slug: slug })
  if (!isCategoryExist) {
    throw createHTTPError(404, `no Category with slug ${slug} exist`)
  }
  title = title.toLowerCase()
  const alreadyExist = await Category.findOne({ title: title })
  if (alreadyExist) {
    throw createHTTPError(409, 'Category with this title already exist')
  }
  const slugExist = await Category.findOne({ slug: slugify(title, { lower: true }) })
  if (slugExist) {
    throw createHTTPError(409, 'Category with this title already exist')
  }
  const updatedCategory = await Category.findOneAndUpdate(
    { slug: slug },
    { title: title, slug: title ? slugify(title, { lower: true }) : slug },
    { new: true }
  )
  return { updatedCategory }
}

// deleting a Category by slug
export const deleteCategory = async (slug: string) => {
  const isCategoryExist = await Category.exists({ slug: slug })
  if (!isCategoryExist) {
    throw createHTTPError(404, `Category with slug ${slug} does not exist`)
  }
  await Category.deleteOne({ slug: slug })
}
