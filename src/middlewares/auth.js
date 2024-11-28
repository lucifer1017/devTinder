const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req?.cookies;
        if (!token) {
            throw new Error("Invalid token")
        }
        const decodedObj = await jwt.verify(token, "bazzinga@001");
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User does not exist");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)

    }
};

module.exports = { userAuth };