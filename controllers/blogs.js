const blogsRouter = require('express').Router()
const Blog = require('../models/blog')



// All blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

// Received data
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = await blog.save()
  response.json(savedBlog)
})

module.exports = blogsRouter