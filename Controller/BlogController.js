const _ = require('lodash'); // Import Lodash
require("dotenv").config();

// Define the caching period in milliseconds (e.g., 1 minutes)
const cachingPeriod = 1 * 60 * 1000; // 1 minutes

// Custom memoization function for fetching and analyzing blog data
const getCachedBlogs = _.memoize(async (req, res) => {
    try {
        // Access blogData from the request object
        const blogData = req.blogData;

        // Checking my blog data is undefined or array response object 
        if (!blogData || !blogData.blogs || !Array.isArray(blogData.blogs)) {
            return res.status(500).json({ error: 'Invalid blog data received from the middleware' });
        }

        const blogs = blogData["blogs"];

        // Calculate the total number of blogs fetched
        const totalBlogs = blogs.length;
    
        // Find the blog with the longest title
        const blogWithLongestTitle = _.maxBy(blogs, (blog) => blog.title.length);
    
        // Determine the number of blogs with titles containing the word "privacy"
        const numberOfBlogsWithPrivacyTitle = _.filter(blogs, (blog) =>
          _.includes(blog.title.toLowerCase(), 'privacy')
          ).length;
    
        // Create an array of unique blog titles (no duplicates)
        const uniqueBlogTitles = _.map(_.uniqBy(blogs, 'title'), 'title');
    
        // Send the analytics results as a JSON response
        res.json({
          totalBlogs,
          blogWithLongestTitle,
          numberOfBlogsWithPrivacyTitle,
          uniqueBlogTitles,
        });
      } catch (error) {
        // Handle any errors that may occur during the request
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}, (req) => req, cachingPeriod);


// Custom memoization function for blog search
const cachedBlogSearch = _.memoize(async (req, res) => {
    try {
        const query = req.query.query; // Get the query parameter from the URL
        if (!query) {
          return res.status(400).json({ error: 'Query parameter is missing' });
        }
    
        // Assuming the response contains the blog data
        const blogData = req.blogData;

        // Checking my blog data is undefined or array response object 
        if (!blogData || !blogData.blogs || !Array.isArray(blogData.blogs)) {
            return res.status(500).json({ error: 'Invalid blog data received from the middleware' });
        }

        const blogs = blogData["blogs"];
    
        // Implement custom search functionality
        const filteredBlogs = blogs.filter((blog) =>
          blog.title.toLowerCase().includes(query.toLowerCase())
        );
    
        // Send the JSON response
        res.json({
          query,
          results: filteredBlogs,
        });
      } catch (error) {
        // Handle any errors that may occur during the request
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
},(req) => req, cachingPeriod);




module.exports = {
    getCachedBlogs,
    cachedBlogSearch, 
};