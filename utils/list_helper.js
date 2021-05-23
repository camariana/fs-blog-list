const dummy = (blogs) => {
  return blogs.length
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => {
    return acc + cur.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((a, b) => {
    return a.likes > b.likes ? a : b
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}