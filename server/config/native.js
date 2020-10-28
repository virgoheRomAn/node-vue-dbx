console.log("当前服务环境：" + process.env.NODE_ENV);

let nativeHost = "";

if (process.env.NODE_ENV === "prod") {
  //正式
  nativeHost = "http://www.dongbaoxian.cn";
} else if (process.env.NODE_ENV === "test") {
  //测试
  nativeHost = "http://api.dongbaoxian.cn";
} else {
  //本地
  nativeHost = "http://api.dongbaoxian.cn";
}

console.log("访问接口服务地址：" + nativeHost);

module.exports = nativeHost;
