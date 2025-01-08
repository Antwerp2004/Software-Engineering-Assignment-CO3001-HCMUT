const userModel = require("../../models/user_model.js")

// [GET] /profile
module.exports.home = async (req, res) => {
    const userID = req.user;
    const profile = await userModel.getUserProfile(userID);

    const dateObj = new Date(profile['Lần đăng nhập gần nhất']);
    const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;

    res.render("./user/pages/profile.pug", {
        name: profile['Tên người dùng'],
        role: profile['Đối tượng'],
        email: profile['Email'],
        remainingPaper: profile['Số dư trang'],
        last: formattedDate
    })
}