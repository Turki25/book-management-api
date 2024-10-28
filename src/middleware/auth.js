require('dotenv').config();
const basicAuth = require('express-basic-auth');

const users = {
    'ejariadmin': process.env.EJARI_ADMIN_PASSWORD, 
};

const auth = basicAuth({
    users: users,
    challenge: true, // This will prompt the user for credentials
    unauthorizedResponse: 'Unauthorized access.' // Message for unauthorized access
});

module.exports = auth;