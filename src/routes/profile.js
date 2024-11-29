const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData, validatePasswordChange } = require('../utils/validation');
const bcrypt = require('bcrypt');
const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user);

    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        const data = req?.body;
        const isEditAllowed = validateEditProfileData(data);
        if (!isEditAllowed) {
            throw new Error("Cannot edit mentioned fields");
        }
        const loggedInUser = req.user;


        Object.keys(req?.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();

        res.json({
            message: loggedInUser.firstName + ",your Profile was updated successfully!",
            data: loggedInUser
        });
    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})
profileRouter.patch('/profile/password', userAuth, async (req, res) => {

    try {

        const { Current, New, Confirm } = req?.body;
        const loggedInUser = req?.user;

        const isMatching = await validatePasswordChange(Current, loggedInUser.password);

        if (!isMatching) {
            throw new Error("Enter correct password");
        }

        else if (New != Confirm) {
            throw new Error("Passwords do not Match,enter again");
        }
        else {
            const newHashedPassword = await bcrypt.hash(New, 10);
            loggedInUser.password = newHashedPassword;
            await loggedInUser.save();
            res.json({ message: "Password updated successfully", data: loggedInUser });
        }
    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})

module.exports = profileRouter;