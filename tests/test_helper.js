const Blog = require('../models/blog')

// array containing the initial database state
const initialBlogs = [
  {
    title: 'An Open Letter to Jason and David',
    author: 'Jane Yang',
    url: 'https://janeyang.org/2021/04/27/an-open-letter-to-jason-and-david/',
    likes: 3
  },
  {
    title: 'Which jobs help people the most?',
    author: 'Benjamin Todd',
    url: 'https://80000hours.org/career-guide/high-impact-jobs/#approach-1-earning-to-give',
    likes: 2
  },
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
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

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}