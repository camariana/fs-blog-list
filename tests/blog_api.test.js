const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

// Blogs
describe('When there is initially some blogs save', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('verify that the _id is named id', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(b => b.id)

    expect(contents).toBeDefined()
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returns blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(b => b.title)

    expect(contents).toContain(
      'Which jobs help people the most?'
    )
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'What we are living for',
      author: 'A. Camariana',
      url: 'camariana.gm',
      likes: 0,
    }

    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)


    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain(
      'What we are living for'
    )
  })

  test('fails with status code 400 if data is invaild', async () => {
    const newBlog = {
      author: 'A. Camariana',
      likes: 0,
    }

    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('default likes property to zero if missing', async () => {
    const newBlog = {
      title: 'What we are living for',
      author: 'A. Camariana',
      url: 'camariana.gm',
    }

    helper.likesToZero(newBlog)

    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(newBlog.likes).toBe(0)
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

    expect(resultBlog.body).toEqual(processedBlogToView)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '60b008eced537cf47239a9b4a'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map(b => b.title)

    expect(contents).not.toContain(blogToDelete.content)
  })
})

describe('updating a blog', () => {
  test('succeeds upon updating a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).not.toEqual(blogToUpdate)
  })
})



// Users
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({
      username: 'root',
      passwordHash
    })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'camariana',
      name: 'A Camariana',
      password: 'jannata',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Super User',
      password: 'jannata',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper status code and message if user is invalid', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Super User',
      password: 'jannata',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})