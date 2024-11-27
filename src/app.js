const express = require('express');

const app = express();
const { authAdmin, userAuth } = require('./middlewares/auth');
const PORT = 8000;
app.use("/admin", authAdmin)
app.get("/admin/getUserData", (req, res) => {

    res.send("Here is the requested data");
})
app.delete("/admin/deleteUser", (req, res) => {

    res.send("User deleted");
})
app.use('/user', userAuth);
app.get("/user", (req, res, next) => { //this fn is known as route handler
    console.log("hello");
    // res.send("got all the users");
    next();
})
app.post("/user", (req, res) => {
    console.log(req.params);
    res.send("saved user to db");
})

app.listen(PORT, () => {
    console.log(`Server running successfully on port:${PORT}`);
})