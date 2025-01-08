const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.BLACKLIST_URI);
        console.log("connect success");
    }
    catch (error) {
        console.log("connect fail");
    }
}