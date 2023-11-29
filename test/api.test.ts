// __tests__/app.test.ts
import request from 'supertest'
import app from '../src/server'
import { Product } from '../src/models/productSchema'
import { IProduct, productInputType } from '../src/types/productTypes'
import slugify from 'slugify'
import { Category } from '../src/models/categorySchema'
import { ICategory } from '../src/types/categoryTypes'
let categoryId = ''
let newCategory = {
  title: 'Desktop11111111',
}
let user = {
  username: 'ththt1htqqh1q1',
  name: 'thththqq1thq11',
  email: 'thth1tqqhthq11@gmail.com',
  address: 'ththqq1ththq11',
  phone: 34534530147511,
  password: 'tht1htqqhthq11',
}
let adminUser = {
  username: 'ttg1gqqttg1qa11',
  name: 'ttgg1tg1qqqa11',
  email: 'ttg1gtqqtqg1a11@gmail.com',
  address: 'tt1ggqqqttg11a1',
  phone: 99080193900111,
  password: 'uu1qiuqqjhyi11a1',
  isAdmin: true,
}
let userId = ''
let token = ''
let passwordToken = ''

describe('Category Routes', () => {
  it('POST /Category', async () => {
    const response = await request(app).post('/categories').send(newCategory)
    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Category created successfully!')
    // expect(response.body.payload).toBeInstanceOf(Category)
    expect(response.body.payload.title).toBe(newCategory.title)
    categoryId = response.body.payload._id
    console.log('categoryId:', categoryId)
  })
  it('GET /products', async () => {
    const response = await request(app).get('/categories')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe(' All Category retrieved Successfully!')
    expect(response.body.payload).toBeInstanceOf(Array)
    expect(response.body.payload.length).toBeGreaterThan(0)
  })
  it('Update /categories/:slug', async () => {
    const slug = slugify(newCategory.title)
    newCategory.title = 'Desktop11111112'
    const response = await request(app)
      .put(`/categories/${slug}`)
      .send({ title: newCategory.title })
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Category updated successfully!')
    expect(response.body.payload.title).toBe(newCategory.title)
  })
  it('GET /products/:slug', async () => {
    const slug = slugify(newCategory.title)
    const response = await request(app).get(`/categories/${slug}`)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Category retrieved successfully!')
    expect(response.body.payload).toBeInstanceOf(Object)
    expect(response.body.payload.title).toBe(newCategory.title)
  })
})

describe('Products Routes', () => {
  it('POST /products', async () => {
    const newproduct = {
      title: 'smart',
      description: 'smartaaaaa',
      price: 2500,
      countInStock: 8,
      sold: 0,
      categories: categoryId,
    }
    const response = await request(app)
      .post('/products')
      .field(newproduct)
      .attach('image', Buffer.from('test content'), 'aa.png')
    expect(response.status).toBe(201)
  })
  it('GET /products', async () => {
    const response = await request(app).get('/products')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Get all products successfully')
    // expect(response.body.payload).toHaveLength(3)
    // expect(response.body.totalPages).toBe(4)
    expect(response.body.currentPage).toBe(1)
  })
  it('Update /products', async () => {
    const newproduct = {
      title: 'smartwatch',
      description: 'smartaawatch',
      price: 2300,
      countInStock: 7,
      sold: 0,
      image: 'aa.png',
      categories: [],
    }

    const response = await request(app)
      .put('/products/smart')
      .field(newproduct)
      .attach('image', Buffer.from('test content'), 'aa.png')
    expect(response.status).toBe(200)
  })
  it('Delete /products', async () => {
      const response = await request(app).delete('/products/smartwatch')
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
    console.log(userId)
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
    expect(response.body.message).toBe('Welcome back')
  })
  it('DELETE /users/:slug Verify for admin ', async () => {
    const slug = slugify(user.username)
    const response = await request(app).delete(`/users/${slug}`)
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Sorry, only admin can do this')
  })
  it('Post /auth/logout', async () => {
    const response = await request(app)
      .post(`/auth/logout`)
      .send({ email: user.email, password: user.password })
    console.log(response)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Logged out successfully')
  })
  it('Post /user/forgot-password', async () => {
    const response = await request(app)
      .post(`/users/forgot-password`)
      .send({ email: user.email, password: user.password })
    console.log(response)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Check your email to reset your password')
    passwordToken = response.body.token
  })
  it('Post /user/reset-password', async () => {
    const response = await request(app)
      .post(`/users/reset-password`)
      .send({ token: passwordToken, password: user.password })
    console.log(response)
    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Password updated successfully')
  })

})
describe('Admin Crud', () => {
  it('Post /users/', async () => {
    const response = await request(app)
      .post('/users/')
      .field(adminUser)
      .attach('image', Buffer.from('test content'), 'aa.png')
    expect(response.status).toBe(201 )
    expect(response.body.message).toBe('User created successfully')
    expect(response.body.payload).toBeInstanceOf(Object)
    expect(response.body.payload.name).toBe(adminUser.name)

    token = response.body.token
    console.log('response.body.isAdmin:',response.body.isAdmin)
  })
  it('Post /auth/login', async () => {
    const response = await request(app)
      .post(`/auth/login`)
      .send({ email: adminUser.email, password: adminUser.password })
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Welcome back')
  })
  it('DELETE /users/:slug Verify for admin ', async () => {
    const slug = slugify(user.username)
    const response = await request(app).delete(`/users/${slug}`)
    console.log(response);
    // expect(response.status).toBe(200)
    expect(response.body.message).toBe('Delete user by slug successfully')
  })

})
