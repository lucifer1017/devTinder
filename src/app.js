const express = require('express');
const { connectToDb } = require('./config/database');
const User = require('./models/user');
const app = express();

const PORT = 8000;

app.post('/signup', async (req, res) => {
    const user = new User({
        firstName: "Karan",
        lastName: "Arora",
        email: "karan@arora.com",
        password: "karan#123"
    });

    try {
        await user.save();
        res.send("User added Successfully");
    } catch (error) {
        res.status(500).send("User not added.")
    }

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



