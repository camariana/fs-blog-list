const dummy = (blogs) => {
  return blogs.length
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => {
    return acc + cur.likes
  }, 0)
}

module.exports = {
  dummy,
  totalLikes
}