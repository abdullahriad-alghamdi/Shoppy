/*======= Node Modules =======*/
import fs from 'fs/promises'
/*======= External Dependencies and Modules =======*/
import slugify from 'slugify'

/*======= Internal Modules or Files =======*/
// Models
import Product from '../models/productSchema'
// Utils
import { createHTTPError } from '../utils/createError'
// Types
import { productInputType, productType, productUpdateType } from '../types/productTypes'

// paginating products with a limit of 3 products per page
export const paginateProducts = async (
  page: number = 1,
  limit: number = 3,
  maxPrice: number = 1000000,
  minPrice: number = 0
) => {
  const skip = (page - 1) * limit
  const count = await Product.countDocuments()
  const totalPages = Math.ceil(count / limit)
  // if the page is greater than the total pages, set the page to the last page
  if (page > totalPages) {
    page = totalPages
  }

  const products = await Product.find({ price: { $lte: maxPrice, $gte: minPrice } })
    .skip(skip)
    .limit(limit)
    .populate('category')
    .sort({ price: -1 })

  return { products, totalPages, currentPage: page }
}

// getting a single product by slug
export const findProduct = async (slug: string) => {
  const product = await Product.findOne({ slug: slug }).populate('category')
  if (!product) {
    throw createHTTPError(404, `Product with slug ${slug} does not exist`)
  }
  return product
}

// creating new product with image
export const createNewProduct = async (product: productType, image: string | undefined) => {
  const { title } = product

  const isProductExist = await Product.exists({ title: title })
  if (isProductExist) {
    throw createHTTPError(409, `Product with title ${title} already exists`)
  }

  const newProduct = new Product({
    ...product,
    slug: slugify(title, { lower: true }),
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
      // update the slug if the title is updated
      ...product,
      slug: title ? slugify(title, { lower: true }) : slug,
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
