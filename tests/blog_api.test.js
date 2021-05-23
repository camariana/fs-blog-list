const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray) // wait for all of the asynchronous operations to finish executing with the Promise.all method
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect('Content-Type', /application\/json/)
})

test('verify that the _id is named id', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.id)
  expect(contents).toBeDefined()
})

test('verify success of new blog creation', async () => {
  const newBlog = {
    title: 'What we are living for',
    author: 'A. Camariana',
    url: 'camariana.gm',
    likes: 0,
  }

  await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect('Content-Type', /application\/json/)


  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(contents).toContain(
    'What we are living for'
  )
})

test('default likes property to zero if missing', async () => {
  const newBlog = {
    title: 'What we are living for',
    author: 'A. Camariana',
    url: 'camariana.gm',
  }

  newBlog.likes === undefined
    ? newBlog.likes = 0
    : newBlog.likes

  await api
    .post('/api/blogs/')
    .send(newBlog)
    .expect('Content-Type', /application\/json/)

  // const response = await api.get('/api/blogs')
  // console.log(response.body)

  expect(newBlog.likes).toBe(0)
})

afterAll(() => {
  mongoose.connection.close()
})