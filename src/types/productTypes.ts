export interface ICategory extends Document {
  _id: string
  title: string
  slug: string
  createdAt: string
  updatedAt: string
  __v: number
}
export interface productType extends Document {
  title: string
  slug: string
  description: string
  price: number
  countInStock: number
  sold: number
  image: string | undefined
  category: ICategory['_id']
  createdAt?: string
  updatedAt?: string
}

export type productInputType = Omit<productType, 'slug' | 'sold'>

export type productUpdateType = Partial<productInputType> | null

export interface Error {
  message?: string
  statusCode?: number
}
