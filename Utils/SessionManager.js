const session = require("express-session")


exports.IsLogin = (req)=> req.session.IsLogin



exports.Login = async (req, UserInfo) => {
    req.session.UserInfo = UserInfo;
    req.session.IsLogin = true;
    return await req.session.save();
}

exports.ShowLogin = (req) => {
  return req.session.UserInfo || null;
}

exports.getSessionUserInfo = (req) => {
  return res.locals.UserInfo;
}
exports.Logout = async (req) => await req.session.destroy();
