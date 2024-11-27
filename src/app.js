const express = require('express');
const { connectToDb } = require('./config/database');
const User = require('./models/user');
const app = express();
const PORT = 8000;
app.use(express.json());
app.post('/signup', async (req, res) => {

    const user = new User(req.body);


    try {
        const result = await user.save();
        if (!result) {
            throw new Error("Cannot Save user")
        }
        res.send("User added Successfully");
    } catch (error) {
        res.status(400).send("User not added." + error.message)
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

app.patch('/user/:id', async (req, res) => {

    const id = req?.params?.id;
    const data = req?.body;
    const ALLOWED_UPDATES = ["gender", "age", "photoUrl", "lastName", "skills", "about"];
    const isAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));

    try {
        if (!isAllowed) {
            throw new Error("Cannot update the given field");
        }
        const user = await User.findByIdAndUpdate(id, data, {
            runValidators: true,
            returnDocument: "before"
        })

        if (!user) {
            res.status(404).send("User Not found");

        }
        else {
            res.send("Updated Successfully");
        }

    } catch (error) {
        res.status(400).send("UPDATE FAILED:" + error.message);
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



