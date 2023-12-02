/*======= External Dependencies and Modules =======*/
import slugify from 'slugify'

/*======= Internal Modules or Files =======*/
// Models
import { Category } from '../models/categorySchema'
// Utils
import { createHTTPError } from '../utils/createError'

// getting all Category
export const getCategories = async (
  page: number = 1,
  limit: number = 3,
  search: string = '',
  sort: string = 'desc'
) => {
  let skip = Math.max(0, (page - 1) * limit)
  const count = await Category.countDocuments()
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
    searchQuery.$or = [{ title: searchRegExp }]
  }
  const filter = {
    __v: 0,
  }

  const categories = await Category.find(searchQuery, filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: sortBy })

  return { categories, totalPages, currentPage: page }
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
  newCategory.save()
  return newCategory
}

// updating a Category by slug
export const updateCategory = async (slug: string, title: string) => {
  const isCategoryExist = await Category.exists({ slug: slug })
  if (!isCategoryExist) {
    throw createHTTPError(404, `Category with slug ${slug} does not exist`)
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
