const validator = require('validator');
const bcrypt = require('bcrypt');
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

const validateEditProfileData = (data) => {
    const editableFields = ['skills', 'about', 'photoUrl', 'age', 'firstName', 'lastName', 'gender'];


    const isEditAllowed = Object.keys(data).every((field) => {
        return editableFields.includes(field);
    })
    return isEditAllowed;


}
const validatePasswordChange = async (receivedPassword, userPasswordHash) => {

    const isReceivedPasswordMatching = await bcrypt.compare(receivedPassword, userPasswordHash);

    return isReceivedPasswordMatching;

}

module.exports = { validateUserSignup, validateEditProfileData, validatePasswordChange };