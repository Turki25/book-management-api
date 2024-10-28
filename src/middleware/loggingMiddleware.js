const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// Create a write stream for logging requests to a file
const logStream = fs.createWriteStream(path.join(__dirname, '../requests.log'), { flags: 'a' });

// Middleware to log requests Only (BCZ i think they usualy do this only)
const requestLogger = morgan('combined', { stream: logStream });

// Custom middleware to log requests and responses
const logRequestsAndResponses = (req, res, next) => {
    // Log the request data
    console.log(`Request: ${req.method} ${req.url}`, req.body);

    // Capture the original res.send method
    const originalSend = res.send.bind(res);

    // Override res.send to log response data
    res.send = (body) => {
        console.log(`Response: ${res.statusCode}`, body); // Log the response
        logStream.write(`Response: ${res.statusCode} ${body}\n`); // Save to log file
        console.log("------------------------------------------------------------------------")
        return originalSend(body); // Call the original res.send
    };
    next(); // Proceed to the next middleware
};

// Export the middleware
module.exports = {
    requestLogger,
    logRequestsAndResponses,
};
