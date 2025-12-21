const mongoose = require('mongoose')
const {User} = require('../models/Users.model')

const connect = () => {
    mongoose.connect(process.env.MONGO_URI)

    mongoose.connection.once("open", async () => {
        try {
            await User.syncIndexes();
            console.log("User indexes synced");
        } catch (err) {
            console.error("Index error:", err);
        }
    });
}

module.exports = {
    connect
}