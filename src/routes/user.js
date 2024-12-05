const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const REQ_USER_DATA = "firstName lastName age gender skills photoUrl about"

userRouter.get('/user/requests/received', userAuth, async (req, res) => {

    try {
        const loggedInUser = req?.user;


        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        })
            .populate("fromUserId", REQ_USER_DATA);
        res.json({
            message: "Here are the Users interested in you",
            connectionRequests
        })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }

})

userRouter.get('/user/connections', userAuth, async (req, res) => {

    try {
        const loggedInUser = req?.user;

        const connectedUsers = await ConnectionRequest.find({

            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        })
            .populate("fromUserId", REQ_USER_DATA)
            .populate("toUserId", REQ_USER_DATA);
        const data = connectedUsers.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString())
                return row?.toUserId;
            else {
                return row?.fromUserId;
            }
        })

        res.json({
            message: "Here is a list of your connections",
            data
        })

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }

})

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        let page = parseInt(req?.query?.page) || 1;
        page = page < 1 ? 1 : page;
        let limit = parseInt(req?.query?.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        const loggedInUser = req?.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");
        const connectedUsers = connectionRequests.map((request) => {
            return request.fromUserId.toString() === loggedInUser._id.toString() ? request.toUserId : request.fromUserId;
        })

        const availableUsers = await User.find({

            $and: [{ _id: { $nin: connectedUsers } },
            { _id: { $ne: loggedInUser._id } }]

        }).select(REQ_USER_DATA).skip(skip).limit(limit);

        res.json({ data: availableUsers });


    } catch (error) {
        res.status(400).json({ message: "ERROR: " + error.message });
    }
})


module.exports = userRouter;