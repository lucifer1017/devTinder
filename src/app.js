const express = require('express');
const { connectToDb } = require('./config/database');
const User = require('./models/user');
const app = express();
const bcrypt = require('bcrypt');
const { validateUserSignup } = require('./utils/validation');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');
const PORT = 8000;
app.use(express.json());
app.use(cookieParser());
app.post('/signup', async (req, res) => {

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

app.post('/login', async (req, res) => {
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

            const token = await user.getJWT();

            res.cookie("token", token, {
                maxAge: 8 * 72000000
            });

            res.send("Login Successful");
        }

    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);

    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})

app.post('/sendConnectionRequest', userAuth, async (req, res) => {

    const user = req.user;

    res.send(user?.firstName + " Sent connection request!");
})

connectToDb()
    .then(() => {
        console.log("Connected to DB successfully");
        app.listen(PORT, () => {
            console.log(`Server running successfully on port:${PORT}`);
        })
    })
    .catch((err) => {
        console.error("Cannot establish connection");
    })



