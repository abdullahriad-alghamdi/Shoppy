/*======= Node Modules =======*/
import fs from 'fs/promises'
/*======= External Dependencies and Modules =======*/
import slugify from 'slugify'

/*======= Internal Modules or Files =======*/
// Models
import { Product } from '../models/productSchema'
// Utils
import { createHTTPError } from '../utils/createError'
// Types
import { productInputType, IProduct, productUpdateType } from '../types/productTypes'

// paginating products with a limit of 3 products per page
export const paginateProducts = async (
  page: number = 1,
  limit: number = 3,
  maxPrice: number = 1000000,
  minPrice: number = 0,
  search: string = '',
  categoryId?: string
) => {
  let skip = Math.max(0, (page - 1) * limit)
  const count = await Product.countDocuments()
  const totalPages = Math.ceil(count / limit)
  // if the page is greater than the total pages, set the page to the last page
  if (page > totalPages) {
    page = totalPages
    skip = Math.max(0, (page - 1) * limit)
  }

  let filter: any = {
    price: { $lte: maxPrice, $gte: minPrice },
  }
  const searchRegExp: RegExp = new RegExp('.*' + search + '.*', 'i')

  if (search) {
    // resting the skip to 0 if the user is searching
    limit = count
    page = 1
    skip = Math.max(0, (page - 1) * limit)
    filter.$or = [{ title: searchRegExp }, { description: searchRegExp }]
  }

  if (categoryId) {
    filter.category = { $eq: categoryId }
  }

  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .populate('categories')
    .sort({ price: -1 })

  return { products, totalPages, currentPage: page }
}

// getting a single product by slug
export const findProduct = async (slug: string) => {
  const product = await Product.findOne({ slug: slug }).populate('categories')
  if (!product) {
    throw createHTTPError(404, `Product with slug ${slug} does not exist`)
  }
  return product
}

// creating new product with image
export const createNewProduct = async (product: IProduct, image: string | undefined) => {
  const { title } = product

  const isProductExist = await Product.exists({ title: title })
  if (isProductExist) {
    throw createHTTPError(409, `Product with title ${title} already exists`)
  }
  const slug = title && typeof title === 'string' ? slugify(title, { lower: true }) : ''
  const newProduct = new Product({
    ...product,
    slug: slug,
    image: image,
  })
  newProduct.save()
  return newProduct
}

// updating product by slug
export const updateProduct = async (slug: string, product: productUpdateType) => {
  const title = product?.title

  const isProductExist = await Product.exists({ slug: slug })
  if (!isProductExist) {
    throw createHTTPError(404, `Product with slug ${slug} does not exist`)
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { slug: slug },
    {
      ...product,
      slug: title && typeof title === 'string' ? slugify(title, { lower: true }) : slug,
      title,
    },
    { new: true }
  )

  return updatedProduct
}

// replacing the old image with the new image in the file system
export const replaceImage = async (
  file: Express.Multer.File | undefined,
  slug: string,
  data: productInputType
) => {
  if (file) {
    data.image = file.path
    // to delete the image from the public folder
    const product = await findProduct(slug)
    if (product.image !== 'public/images/default.png') {
      fs.unlink(product.image)
    }
  }
}

// deleting product by slug
export const deleteProduct = async (slug: string) => {
  const isProductExist = await Product.exists({ slug: slug })
  if (!isProductExist) {
    throw createHTTPError(404, `Product with slug ${slug} does not exist`)
  }

  await Product.deleteOne({ slug: slug })
}
