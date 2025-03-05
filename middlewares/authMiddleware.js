const User = require('../models/User');

// Middleware to check if the user is logged in
const authenticateUser = async (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login'); // Redirect to login if not logged in
    }
    next();
};

// Middleware to check user roles
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.session.user || !roles.includes(req.session.user.role)) {
            return res.status(403).send("Login Again");
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeRole };
