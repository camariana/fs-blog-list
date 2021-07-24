const listHelper = require('./utils/list_helper')
const blogList = require('./utils/blog_list')

test('dummy returns one', () => {
  const blogs = blogList.oneBlog

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})



describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(listHelper.totalLikes(blogList.emptyBlog)).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    expect(listHelper.totalLikes(blogList.oneBlog)).toBe(9)
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(blogList.manyBlogs)).toBe(15)
  })
})



describe('favorite blog', () => {
  const blogs = blogList.manyBlogs

  const results = {
    'likes': 9,
    'title': 'An Open Letter to Jason and David',
    'author': 'Jane Yang',
    'url': 'https://janeyang.org/2021/04/27/an-open-letter-to-jason-and-david/',
  }

  test('the favorite blog', () => {
    expect(listHelper.favoriteBlog(blogs)).toEqual(results)
  })

})



describe('most blogs', () => {
  const blogs = blogList.manyBlogs

  const results = {
    author: 'Jane Yang',
    blogs: 2
  }

  test('the most blogs', () => {
    expect(listHelper.mostBlogs(blogs)).toEqual(results)
  })

})



describe('most likes', () => {
  const blogs = blogList.manyBlogs

  const results = {
    author: 'Jane Yang',
    likes: 9
  }

  test('the most likes', () => {
    expect(listHelper.mostLikes(blogs)).toEqual(results)
  })

})