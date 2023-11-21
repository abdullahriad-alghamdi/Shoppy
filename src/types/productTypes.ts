export type product = {
  title: string
  slug: string
  description: string
  price: number
  countInStock: number
  sold: number
}

export type productInput = Omit<product, 'slug' | 'sold'>

// to solve the problem with null values
export type productUpdate = Partial<productInput> | null

export interface Error {
  message?: string
  statusCode?: number
}
