const session = require("express-session")
exports.IsLogin = (req)=> req.session.IsLogin



exports.Login = async (req, UserInfo) => {
    req.session.UserInfo = UserInfo;
    req.session.IsLogin = true;
    return await req.session.save();
}

exports.ShowLogin = (req) => {
  return req.session.UserInfo;
}
exports.Logout = (req) => req.session.destroy();
