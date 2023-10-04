const axios = require('axios');
const _ = require('lodash');
require("dotenv").config();

const cachingPeriod = 1 * 60 * 1000; // 5 seconds

// Define a custom resolver function for _.memoize that generates cache keys based on arguments
const customResolver = (...args) => JSON.stringify(args);

// Create a memoized function using _.memoize with custom resolver and cache expiration
const memoizedFetchBlogs = _.memoize(
    async () => {
        try {
            const authHeader = { 'x-hasura-admin-secret': process.env.ADMIN_SECRET }
            const response = await axios.get(process.env.BLOG_API_URL, {
                headers: authHeader
            });

            // Check if the response status is not in the 200-299 range
            if (response.status >= 200 && response.status < 300) {
                return response.data; // Return the data from the response
            } else {
                throw new Error({ error: 'Third-party API request failed', message: error.message });
            }
        } catch (error) {
            throw new Error({ error: 'Third-party API request failed', message: error.message });
        }
    },
    customResolver, // Custom resolver function
    cachingPeriod // Cache expiration period in milliseconds
);

// Custom memoization function for the blogFetch middleware with header token
const fetchBlog = async (req, res, next) => {
    try {
        // Fetch the blog data using the memoized function
        const blogData = await memoizedFetchBlogs();

        // Attach blogData to the request object
        req.blogData = blogData;

        next();
    } catch (error) {
        res.status(500).json({ error: 'Middleware error', message: error.message });
    }
};

// Export the memoized middleware
exports.blogFetch = fetchBlog;