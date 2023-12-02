// __tests__/app.test.ts
import request from 'supertest'
import app from '../src/server'
import { Product } from '../src/models/productSchema'
import { IProduct, productInputType } from '../src/types/productTypes'
import slugify from 'slugify'
import { Category } from '../src/models/categorySchema'
import { ICategory } from '../src/types/categoryTypes'
import mongoose from 'mongoose'
import { dev } from '../src/config'
import { Server } from 'http'
let categoryId = ''

let newCategory = {
  title: 'smartphone',
}
let newproduct = {
  title: 'iphone',
  description: 'iPhone 15 Pro Max',
  price: 5500,
  countInStock: 8,
  category: '',
}
let user = {
  username: 'mohammed',
  name: 'mohammed',
  email: 'mohd@gmail.com',
  address: 'Riyadh',
  phone: 111111111,
  password: '12345678',
}
let adminUser = {
  username: 'ahmad',
  name: 'ahmad',
  email: 'ah@gmail.com',
  address: 'Riyadh',
  phone: 22222222,
  password: '12345678',
  isAdmin: true,
}
let userId = ''
let token = ''
let passwordToken = ''
let accessToken = ''
let server: Server | null = null
beforeAll(async () => {
  try {
    const port: string | number = dev.app.port
    server = app.listen(port)
    await mongoose.connect(dev.db.url)
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed: ' + error)
    // process.exit(1) // this will exit the application with a failure
  }
})

describe('Category Routes', () => {
  it('POST /category', async () => {
    const response = await request(app).post('/categories').send(newCategory)
    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Category created successfully!')
    // expect(response.body.payload).toBeInstanceOf(Category)
    expect(response.body.payload.title).toBe(newCategory.title)
    categoryId = response.body.payload._id
  })
  it('GET /categories', async () => {
    const response = await request(app).get('/categories')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe(' All Category retrieved Successfully!')
    expect(response.body.payload).toBeInstanceOf(Array)
    // expect(response.body.payload.length).toBeGreaterThan(0)
  })
  it('Update /categories/:slug', async () => {
    const slug = slugify(newCategory.title)
    newCategory.title = 'desktop'
    const response = await request(app)
      .put(`/categories/${slug}`)
      .send({ title: newCategory.title })
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Category updated successfully!')
    expect(response.body.payload.title).toBe(newCategory.title)
  })
  it('GET /categories/:slug', async () => {
    const slug = slugify(newCategory.title)
    const response = await request(app).get(`/categories/${slug}`)
    categoryId = response.body.payload._id
    newproduct.category = categoryId
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Category retrieved successfully!')
    expect(response.body.payload).toBeInstanceOf(Object)
    expect(response.body.payload.title).toBe(newCategory.title)
  })
})

describe('Products Routes', () => {
  it('POST /products', async () => {
    const response = await request(app)
      .post('/products')
      .field(newproduct)
      .attach('image', Buffer.from('test content'), 'aa.png')
    expect(response.body.message).toBe('Product added successfully')
    expect(response.status).toBe(201)
  }, 10000)
  it('GET /products', async () => {
    const response = await request(app).get('/products')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Get all products successfully')
    expect(response.body.currentPage).toBe(1)
  })
  it('Update /products', async () => {
    const slug = slugify(newproduct.title)
    newproduct.title = 'samsung'
    const response = await request(app)
      .put(`/products/${slug}`)
      .field(newproduct)
      .attach('image', Buffer.from('test content'), 'aa.png')
    expect(response.status).toBe(200)
  })
  it('Delete /products', async () => {
    const slug = slugify(newproduct.title)
    const response = await request(app).delete(`/products/${slug}`)
    expect(response.status).toBe(200)
  })
  it('Delete /categories', async () => {
    const slug = slugify(newCategory.title)
    const response = await request(app).delete(`/categories/${slug}`)
    expect(response.status).toBe(200)
  })
})

describe('User Crud', () => {
  it('Post /users/register', async () => {
    const response = await request(app)
      .post('/users/register')
      .field(user)
      .attach('image', Buffer.from('test content'), 'aa.png')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Check your email to verify your account')

    token = response.body.token
  })
  it('POST /users/activate', async () => {
    const response = await request(app).post('/users/activate').send({ token: token })
    expect(response.status).toBe(201)
    expect(response.body.message).toBe('user registered successfully')
  })
  it('Post /auth/login', async () => {
    const response = await request(app)
      .post(`/auth/login`)
      .send({ email: user.email, password: user.password })
    expect(response.status).toBe(200)
    expect(response.body.message).toBe(`Welcome ${user.name}!`)

    const setCookieHeader = response.headers['set-cookie']
    accessToken = setCookieHeader[0].split('=')[1].split(';')[0]
    console.log('accessToken', accessToken)
  })
  it('DELETE /users/:slug Verify for admin ', async () => {
    const slug = slugify(user.username)
    const response = await request(app)
      .delete(`/users/${slug}`)
      .set('Cookie', [`access_token=${accessToken}`])
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Sorry, only admin can do this')
  })
  it('Post /auth/logout', async () => {
    const response = await request(app)
      .post(`/auth/logout`)
      .send({ email: user.email, password: user.password })
      .set('Cookie', [`access_token=${accessToken}`])
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Logout successfully')
  })
  it('Post /user/forgot-password', async () => {
    const response = await request(app)
      .post(`/users/forgot-password`)
      .send({ email: user.email, password: user.password })
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Check your email to reset your password')
    passwordToken = response.body.token
  })
  it('Post /user/reset-password', async () => {
    const response = await request(app)
      .post(`/users/reset-password`)
      .send({ token: passwordToken, password: user.password })
    expect(response.status).toBe(201)
    expect(response.body.message).toBe('password reset successfully')
  })
})
describe('Admin Crud', () => {
  it('Post /users/', async () => {
    const response = await request(app)
      .post('/users/')
      .field(adminUser)
      .attach('image', Buffer.from('test content'), 'aa.png')
    expect(response.body.message).toBe('User created successfully')
    expect(response.status).toBe(201)
    expect(response.body.payload).toBeInstanceOf(Object)
    expect(response.body.payload.name).toBe(adminUser.name)

    token = response.body.token
  })
  it('Post /auth/login', async () => {
    const response = await request(app)
      .post(`/auth/login`)
      .send({ email: adminUser.email, password: adminUser.password })
    expect(response.status).toBe(200)
    expect(response.body.message).toBe(`Welcome ${adminUser.name}!`)
    const setCookieHeader = response.headers['set-cookie']
    accessToken = setCookieHeader[0].split('=')[1].split(';')[0]
  })
  it('DELETE /users/:slug Verify for admin', async () => {
    const slug = slugify(user.username)
    const response = await request(app)
      .delete(`/users/${slug}`)
      .set('Cookie', [`access_token=${accessToken}`])
    expect(response.body.message).toBe('Delete user by slug successfully')
  })
  it('DELETE /users/:slug Verify for admin', async () => {
    const slug = slugify(adminUser.username)
    const response = await request(app)
      .delete(`/users/${slug}`)
      .set('Cookie', [`access_token=${accessToken}`])
    expect(response.body.message).toBe('Delete user by slug successfully')
  })
})

afterAll(async () => {
  server!.close()
  await mongoose.disconnect()
  await mongoose.connection.close()
})
