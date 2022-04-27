const commentsRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')

commentsRouter.get('/', async (request, response) => {
  const comments = await Comment
    .find({})
  response.json(comments)
})

commentsRouter.post('/:id', async (request, response) => {
  const body = request.body
  const blogId = request.params.id

  const blog = await Blog.findById(blogId)

  const comment = new Comment({
    comment: body.comment,
    blog: blog._id
  })

  const savedComment = await comment.save()
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()

  response.json(savedComment)
})


module.exports = commentsRouter