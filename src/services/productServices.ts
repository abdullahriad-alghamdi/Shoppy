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
export const getProducts = async (
  page: number = 1,
  limit: number = 4,
  maxPrice: number = 1000000,
  minPrice: number = 0,
  search: string = '',
  categoryId?: string,
  sort: string = 'desc'
) => {
  let skip = Math.max(0, (page - 1) * limit)
  const count = await Product.countDocuments()
  const totalPages = Math.ceil(count / limit)
  const sortBy = sort === 'asc' ? 1 : sort === 'desc' ? -1 : -1

  // if the page is greater than the total pages, set the page to the last page
  if (page > totalPages) {
    page = totalPages
    skip = Math.max(0, (page - 1) * limit)
  }
  const options = {
    __v: 0,
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
    page = 1
    skip = Math.max(0, (page - 1) * limit)
    limit = count
  }
  // if sort active, sort by price but make sure it work with pagination so the lowest price will be on the first page

  const products = await Product.find(filter, options)
    .skip(skip)
    .limit(limit)
    .populate('category', 'title')
    .sort({ price: sortBy })

  return { products, pagination: { totalPages, currentPage: page, totalProducts: count } }
}

// getting a single product by slug
export const findProduct = async (slug: string) => {
  const product = await Product.findOne({ slug: slug }).populate('category', 'title')
  if (!product) {
    throw createHTTPError(404, `Product with slug ${slug} does not exist`)
  }
  return product
}

// creating new product with image
export const createNewProduct = async (product: IProduct, image: string | undefined) => {
  const { title, sold, quantity, countInStock, category } = product

  const isProductExist = await Product.exists({ title: title })
  if (isProductExist) {
    throw createHTTPError(409, `Product with title ${title} already exists`)
  }
  const slug = title && typeof title === 'string' && slugify(title, { lower: true })
  const newProduct = await Product.create({
    ...product,
    slug: slug,
    image: image,
    quantity: quantity,
    countInStock: quantity,
    sold: quantity - countInStock > 0 ? quantity - countInStock : sold,
    category: category,
  })

  newProduct.save()
  return newProduct
}

// updating product by slug
export const updateProduct = async (slug: string, product: productUpdateType) => {
  const { title, quantity } = product

  const isProductExist = await Product.exists({ slug: slug })
  if (!isProductExist) {
    throw createHTTPError(404, `Product with slug ${slug} does not exist`)
  }

  const oldProductValues = await Product.findOne({ slug: slug })

  if (title === oldProductValues?.title) {
    const isTitleExist = await Product.exists({ title: title })
    if (isTitleExist) {
      throw createHTTPError(409, `Product with title ${title} already exists`)
    }
  }
  if (oldProductValues) {
    const newQuantity = quantity ? quantity + oldProductValues.quantity : oldProductValues.quantity
    // Calculate new count in stock and sold units based on provided quantities

    const newCountInStock = newQuantity
      ? newQuantity - oldProductValues.sold
      : oldProductValues.countInStock

    const newSold =
      newQuantity && newCountInStock ? newQuantity - newCountInStock : oldProductValues.sold

    const updateProduct = await Product.findOneAndUpdate(
      { slug: slug },
      {
        quantity: newQuantity,
        slug:
          title && typeof title === 'string' && title !== ''
            ? slugify(title, { lower: true })
            : oldProductValues.slug,
        countInStock: newCountInStock,
        sold: newSold,

        title: title === '' ? oldProductValues.title : title,
        category: product.category ? product.category : oldProductValues.category,
        description: product.description,
        price: product.price,
        image: product.image,
      },
      { new: true }
    )
    return updateProduct
  }
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
