const express = require('express');
const router = require('./routes/bookRoutes');
const { requestLogger, logRequestsAndResponses } = require('./middleware/loggingMiddleware');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(requestLogger); // Log requests to file
app.use(logRequestsAndResponses); // Log both requests and responses

// Routes
app.use('/api', router);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
