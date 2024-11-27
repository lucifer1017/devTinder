const mongoose = require('mongoose');

const connectToDb = async () => {
    await mongoose.connect("mongodb+srv://lucifergrey1017:zraFWYLpGyquYfP3@cluster0.xov16.mongodb.net/devTinder");
}

module.exports = { connectToDb };