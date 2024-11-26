const express = require('express');

const app = express();

const PORT = 8000;


app.use("/test", (req, res) => {  //this fn is known as the request handler.
    res.send("Hey there!");
})
app.use("/best", (req, res) => {  //this fn is known as the request handler.
    res.send("Hey there!");
})
app.listen(PORT, () => {
    console.log(`Server running successfully on port: ${PORT}`);
})