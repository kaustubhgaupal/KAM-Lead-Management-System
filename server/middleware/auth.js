const jwt = require('jsonwebtoken');


const auth = (req, res, next) => {
    const token = req.cookies.auth_token; // Read token from cookies

    if (!token) {
        res.render('Login' ,{error :"login to to access dashboard"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId; // Add user ID to request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
    // console.log(req.user);
};

module.exports = auth;
