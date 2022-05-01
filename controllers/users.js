const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    //.populate('blogs', { title: 1 }) // no need for this now
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

// Delete a user
usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndDelete(request.params.id)

  response.status(204).end()
})


module.exports = usersRouter