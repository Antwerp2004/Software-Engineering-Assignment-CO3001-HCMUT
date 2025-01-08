const helper = require("../../helper.js")
const userModel = require("../../models/user_model.js")

// [GET] /login
module.exports.home = async (req, res) => {
    res.render("./user/pages/login.pug")
}

// [POST] /login
module.exports.verify = async (req, res) => {
    // console.log(req.body)
    const userEmail = req.body.userID;
    const isExisting = await userModel.checkUserEmail(userEmail);

    if (!isExisting) {
        res.redirect("/login");
        return;
    }

    const userID = await userModel.getUserID(userEmail);

    let options = {
        maxAge: 20 * 60 * 1000, // would expire in 20minutes
        httpOnly: true, // The cookie is only accessible by the web server
        secure: true,
        sameSite: "None",
        signed: true
    };
    const token = helper.generateAccessJWT(userID, "user"); // generate session token for user
    res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
    res.redirect("/");
}