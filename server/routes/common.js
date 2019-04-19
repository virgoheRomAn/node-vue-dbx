const COMMON = {
  notUserInfo: function (request, response) {
    if (!request.session.token) {
      response.send({
        code: 401,
        message: '请先登录',
        data: {}
      })
    }
  }
};

module.exports = COMMON;

