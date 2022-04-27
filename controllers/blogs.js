const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor



// All blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { comment: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

// Received data
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const userObj = request.user

  const user = await User.findById(userObj.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
})

// Get a single blog
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    return response.json(blog)
  } else {
    response.status(404).end()
  }
})

// Delete a blog
blogsRouter.delete('/:id', userExtractor, async (request, response) => {

  const userObj = request.user
  const user = await User.findById(userObj.id)

  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() !== user._id.toString() ) {
    return response.status(401).json({ error: 'you do not have the permission to delete this' })
  }

  await Blog.findByIdAndDelete(blog)
  response.json({ deleted: 'blog deleted' })
  response.status(204).end()
})

// Update one blog
blogsRouter.put('/:id',  async (request, response) => {
  const body = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter