const express = require('express');
const { connectToDb } = require('./config/database');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = 8000;
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

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



