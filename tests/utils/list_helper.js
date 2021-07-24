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



const mostBlogs = (blogs) => {

  const countMostBlogs = blogs.reduce((allAuthors, { author }) => {
    if (author in allAuthors) {
      allAuthors[author]++
    } else {
      allAuthors[author] = 1
    }
    return allAuthors
  }, {})



  const mostBlogsArray = []

  for(const key in countMostBlogs) {
    // eslint-disable-next-line no-prototype-builtins
    if (countMostBlogs.hasOwnProperty(key)) {
      mostBlogsArray.push({
        author: key,
        blogs: countMostBlogs[key]
      })
    }
  }

  const result = mostBlogsArray.reduce((a, b) => {
    return a.blogs > b.blogs ? a : b
  }, {})

  return result
}



const mostLikes = (blogs) => {

  const countMostLikes = blogs.reduce((allLikes, { author, likes }) => {
    allLikes[author] = allLikes[author] || 0
    allLikes[author] += likes
    return allLikes
  }, {})

  const mostLikesArray = []

  for(const key in countMostLikes) {
    // eslint-disable-next-line no-prototype-builtins
    if (countMostLikes.hasOwnProperty(key)) {
      mostLikesArray.push({
        author: key,
        likes: countMostLikes[key]
      })
    }
  }

  const result = mostLikesArray.reduce((a, b) => {
    return a.likes > b.likes ? a : b
  }, {})

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}