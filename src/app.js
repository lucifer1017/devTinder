const express = require('express');

const app = express();

const PORT = 8000;


app.get("/user", (req, res, next) => { //this fn is known as route handler
    console.log("hello");
    // res.send("got all the users");
    next();
})
app.post("/user", (req, res) => {
    res.send("saved user to db");
})
app.get("/user/:userId/:hey/:yoyo", (req, res) => {
    console.log(req.params);
    res.send("got all the users");
})
app.listen(PORT, () => {
    console.log(`Server running successfully on port: ${PORT}`);
})