const dev = require("./dev")

function proxy() {
  let source = dev.system;
  let result = {};
  for (key in source) {
    var uri = '/' + key;
    var reg = '^/' + key;

    result[uri] = {
      target: source[key],
      changeOrigin: true,
      pathRewrite: {}
    }
    result[uri].pathRewrite[reg] = '';
  }
  return result;
}

const proxyData = proxy();

module.exports = proxyData;