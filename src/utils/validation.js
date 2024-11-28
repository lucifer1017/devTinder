const validator = require('validator');

const validateUserSignup = (data) => {
    const { firstName, lastName, email, password } = data;
    if (!firstName || !lastName) {
        throw new Error("Invalid Name");
    }
    else if (!validator.isEmail(email)) {
        throw new Error("Invalid Email");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Password entered is not Strong");
    }

}

module.exports = { validateUserSignup };