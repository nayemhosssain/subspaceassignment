const express = require('express');
const BlogsController = require('../Controller/BlogController');
const {blogFetch} = require('../Middleware/blogFetchMiddleware')
const blogsRouter = express.Router();




blogsRouter.get('/api/blog-stats', blogFetch, BlogsController.getCachedBlogs);
blogsRouter.get('/api/blog-search', blogFetch, BlogsController.cachedBlogSearch)







module.exports = blogsRouter;