var dev = require("./env.dev");
var prod = require("./env.prod");

console.log("当前服务环境：" + process.env.NODE_ENV);

var native = process.env.NODE_ENV === "prod" ? prod : dev;

module.exports = native;
