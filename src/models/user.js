const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email Address");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Please enter a Stronger Password");
            }
        }
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    photoUrl: {
        type: String,
        default: "https://www.google.com/imgres?q=user%20photo&imgurl=https%3A%2F%2Fcdn-icons-png.flaticon.com%2F512%2F21%2F21104.png&imgrefurl=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fuser-picture_21104&docid=nKbZ7-T8tpkWLM&tbnid=P6AlQsrs5ks3RM&vet=12ahUKEwiq9ZDRgv2JAxWQsVYBHcFyHXAQM3oECF8QAA..i&w=512&h=512&hcb=2&ved=2ahUKEwiq9ZDRgv2JAxWQsVYBHcFyHXAQM3oECF8QAA",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo URL");
            }
        }
    },
    about: {
        type: String,
        default: "Available"
    },
    skills: {
        type: [String],
        validate(value) {
            if (value.lenght > 10) {
                throw new Error("Cannot add more than 10 Skills");
            }
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);