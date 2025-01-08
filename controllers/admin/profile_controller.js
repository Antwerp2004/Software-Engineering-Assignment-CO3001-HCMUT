const userModel = require("../../models/user_model.js")

// [GET] /admin/profile
module.exports.home = async (req, res) => {
    const userID = req.user;
    const profile = await userModel.getAdminProfile(userID)

    res.render("./admin/pages/profile.pug", {
        profile: profile
    })
}