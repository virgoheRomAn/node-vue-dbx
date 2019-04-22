console.log("当前服务环境：" + process.env.NODE_ENV);

var nativeHost = "";

if (process.env.NODE_ENV === "prod") {
  //正式
  nativeHost = "http://52car8.com";
} else if (process.env.NODE_ENV === "test") {
  //测试
  nativeHost = "http://52car8.com";
} else {
  //本地
  nativeHost = "http://52car8.com";
}

console.log("访问接口服务地址：" + nativeHost);

module.exports = nativeHost;