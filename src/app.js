const express = require('express');
const { connectToDb } = require('./config/database');
const User = require('./models/user');
const app = express();
const PORT = 8000;
app.use(express.json());
app.post('/signup', async (req, res) => {

    const user = new User(req.body);

    try {
        await user.save();
        res.send("User added Successfully");
    } catch (error) {
        res.status(500).send("User not added.")
    }

})
app.get('/user', async (req, res) => {
    const userEmail = req?.body?.email;

    try {
        const user = await User.find({ email: userEmail });
        if (user.length === 0) {
            res.status(404).send("User Not found");

        }
        else {
            res.send(user);
        }

    } catch (error) {
        res.status(400).send("Something went wrong");
    }

})

app.delete('/user', async (req, res) => {
    const id = req?.body?.id;

    try {
        const user = await User.findByIdAndDelete({ _id: id });
        console.log(user);
        if (!user) {
            res.status(404).send("User Not found");

        }
        else {
            res.send("User Deleted Successfully");
        }
    } catch (error) {
        res.status(400).send("Something went wrong");
    }

})

app.patch('/user', async (req, res) => {

    const { oldemail, newemail } = req?.body;

    try {
        const user = await User.findOneAndUpdate({ email: oldemail }, { email: newemail });

        if (!user) {
            res.status(404).send("User Not found");

        }
        else {
            res.send("Updated Successfully");
        }

    } catch (error) {
        res.status(400).send("Something went wrong");
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



