var common_function = {
  parseResponseData:function(res,successCode){
    var resData = {
      code: 200,
      message: '',
      data: {}
    }
    var data = res.data
    if (data.code === successCode) {
      var result = data.data
      resData.data = result || {}
      resData.code = 200
      resData.message = '请求成功'
    } else {
      resData.data = {}
      resData.code = data.code
      resData.message = data.message
    }
    return resData;
  },
  sessionUserInfo:function(request){
    return request.session.userInfo
  },
  notLoginData:function (request,response) {
    if(!this.sessionUserInfo(request)){
      response.send({
        code: 401,
        message: '请先登录',
        data: {}
      })
      return true;
    }else{
      return false;
    }
  },
  parseErrorData:function(err){
    var data = err.response.data
    if(data.status){
      return {
        code: data.status,
        message: data.message+'('+data.error+')',
        data: null
      }
    }else{
      return data
    }
  },
  getEndDayByMonth:function(year,month){
    var d = new Date(year, month, 0);
    return d.getDate();
  }
};

module.exports = common_function;

