const session = require("express-session")


exports.IsLogin = (res)=> res.locals.IsLoggedIn



exports.Login = async (req, UserInfo) => {
    req.session.UserInfo = UserInfo;
    req.session.IsLogin = true;
    return await req.session.save();
}

exports.ShowLogin = (res) => {
  return res.locals.UserInfo;
}

exports.getSessionUserInfo = (res) => {
  return res.locals.UserInfo;
}
exports.Logout = async (req) => await req.session.destroy();
