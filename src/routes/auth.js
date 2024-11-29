const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateUserSignup } = require('../utils/validation');
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {

    const data = req?.body;
    try {
        validateUserSignup(data);
        const passwordHash = await bcrypt.hash(data.password, 10);
        data.password = passwordHash;

        const user = new User(data);

        const result = await user.save();
        if (!result) {
            throw new Error("Cannot Save user")
        }
        res.send("User added Successfully");
    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }

})
authRouter.post('/login', async (req, res) => {
    const { email, password } = req?.body;
    try {

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            throw new Error("Invalid Credentials");
        }
        else {

            const token = user.getJWT();

            res.cookie("token", token, {
                maxAge: 8 * 72000000
            });

            res.send("Login Successful");
        }

    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})
authRouter.post('/logout', async (req, res) => {

    res.cookie("token", null, {
        maxAge: 0
    })
    res.send("Logged out successfully");
})
// authRouter.get('/findUser', async (req, res) => {

//     const { id } = req?.body;
//     const foundUser = await User.findById(id);
//     console.log(foundUser);
//     res.send("NP");
// })
module.exports = authRouter;