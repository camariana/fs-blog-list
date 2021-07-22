const Blog = require('../../models/blog')
const Users = require('../../models/user')

// array containing the initial database state
const initialBlogs = [
  {
    'likes': 9,
    'title': 'An Open Letter to Jason and David',
    'author': 'Jane Yang',
    'url': 'https://janeyang.org/2021/04/27/an-open-letter-to-jason-and-david/',
  },
  {
    'likes': 2,
    'title': 'Which jobs help people the most?',
    'author': 'Benjamin Todd',
    'url': 'https://80000hours.org/career-guide/high-impact-jobs/#approach-1-earning-to-give',
  },
  {
    'likes': 4,
    'title': 'A Complete Guide To Accessible Front-End Components',
    'author': 'Vitaly Friedman',
    'url': 'https://www.smashingmagazine.com/2021/03/complete-guide-accessible-front-end-components/',
  }
]

// used for creating a database object ID that does not belong to any blog object in the database.
const nonExistingId = async () => {
  const blog = new Blog({
    title: 'will remove this soon',
    author: 'A. Camariana',
    url: 'camariana.gm',
    likes: 0
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

// used for checking the blogs stored in the database
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

// used for checking the users stored in the database
const usersInDb = async () => {
  const users = await Users.find({})
  return users.map(user => user.toJSON())
}

const likesToZero = async (blog) => {
  return blog.likes === undefined
    ? blog.likes = 0
    : blog.likes
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  likesToZero
}