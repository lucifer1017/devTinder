const express = require('express');

const app = express();

const PORT = 8000;

app.get('/getUserData', (req, res) => {

    throw new Error("not found");


})

app.get("/user", (req, res) => { //this fn is known as route handler
    console.log("hello");
    res.send("gotUserData");
})

app.use('/', (err, req, res, next) => {
    if (err) {
        res.status(500).send("Something went wrong");
    }
})
app.listen(PORT, () => {
    console.log(`Server running successfully on port:${PORT}`);
})