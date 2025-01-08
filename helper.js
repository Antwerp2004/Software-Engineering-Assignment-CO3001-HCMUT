const jwt = require("jsonwebtoken")
const { SECRET_ACCESS_TOKEN } = require("./configs/system.js")

module.exports.generateAccessJWT = function (ID, role) {
    let payload = {
        id: ID,
        role: role
    };
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
        expiresIn: '20m',
    });
};