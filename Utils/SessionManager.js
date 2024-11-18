
exports.IsLogin = (req)=> req.session.IsLogin



exports.Login = (req, UserInfo) => {
    req.session.UserInfo = UserInfo;
    req.session.IsLogin = true;
    return req.session.save();
}


exports.Logout = (req) => req.session.destroy();
