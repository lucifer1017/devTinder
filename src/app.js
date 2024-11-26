const express = require('express');

const app = express();

const PORT = 8000;


app.get("/user", (req, res) => {
    res.send("got all the users");
})
app.post("/user", (req, res) => {
    res.send("saved user to db");
})
app.listen(PORT, () => {
    console.log(`Server running successfully on port: ${PORT}`);
})