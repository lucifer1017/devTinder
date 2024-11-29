const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {

    try {

        const fromUserId = req?.user?._id;
        const { status, toUserId } = req?.params;
        if (fromUserId == toUserId) {
            throw new Error("Cannot send request to yourself");
        }
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid Status type: " + status,

            });
        }
        const toUser = User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User Not found" });
            // throw new Error("User does not exist");
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection Request already sent" });
            // throw new Error("Connection Request already sent");
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        console.log(connectionRequest);
        await connectionRequest.save();

        res.json({
            message: "Request sent successfully",
            data: connectionRequest
        })

    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }
})
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {

    try {
        const loggedInUser = req?.user;
        const { status, requestId } = req?.params;
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid Status type: " + status });
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });
        if (!connectionRequest) {
            return res.status(404).json({
                message: "Connection Request not found"
            })
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: "Connection Request: " + status,
            data
        });


    } catch (error) {
        res.status(400).send("Error: " + error.message)
    }

})

module.exports = requestRouter;