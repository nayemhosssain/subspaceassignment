const axios = require('axios');
const _ = require('lodash');
require("dotenv").config();


// Define the caching period in milliseconds (e.g., 1 minutes)
const cachingPeriod = 1 * 60 * 1000; // 1 minutes

// // Custom memoization function for the blogFetch middleware with header token
const memoizedBlogFetch = _.memoize(async (req,res,next)=>{
    try {
        const authHeader = {'x-hasura-admin-secret': process.env.ADMIN_SECRET}
        const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
                headers: authHeader
            });

        // Check if the response status is not in the 200-299 range
        if (response.status < 200 || response.status >= 300) {
            return res.status(response.status).json({ error: 'Third-party API request failed' });
        }   

        // Assuming the response contains the blog data
            const blogData = response.data;

        // Attach blogData to the request object
            req.blogData = blogData;

            next();
        
      } catch (error) {
        if (error.response) {
            // The request was made, but the server responded with a status code outside the 2xx range
            res.status(error.response.status).json({ error: 'Third-party API request failed', message: error.message });
        } else if (error.request) {
            // The request was made but no response was received
            res.status(500).json({ error: 'No response received from the third-party API', message: error.message });
        } else {
            // Something else went wrong
            res.status(500).json({ error: 'Middleware error', message: error.message });
        }
      }
    
    
}, (req) => {
    // Generate a dynamic cache key based on request characteristics (e.g., URL)
    return req.originalUrl; // Using the request's URL as the cache key
  }, cachingPeriod);

// Export the memoized middleware
exports.blogFetch = memoizedBlogFetch;