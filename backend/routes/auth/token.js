jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const bearerToken = req.cookies.token;
    if (typeof bearerToken === 'undefined') {
        await res.json({notification: {isError: false, message: "Unauthorized"}})
    } else {
        try {
            // const bearerToken = bearerHeader.split(' ')[1];
            req.userData = await jwt.verify(bearerToken, 'secretkey');
        } catch (e) {
            return await res.json({notification: {isError: false, message: "Unauthorized"}})
        }
        next();
    }
};

module.exports = verifyToken;
