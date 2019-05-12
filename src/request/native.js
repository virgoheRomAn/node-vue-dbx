const ENV = process.env.NODE_ENV;
let _ajax_host_ = "", _share_host_ = "";

console.log(`${ENV}`);

if (ENV === "prod") {
  _ajax_host_ = "http://money.tongrong365.com";
  _share_host_ = "http://money.tongrong365.com";
} else if (ENV === "test") {
  _ajax_host_ = "http://wtest.dongbaoxian.cn";
  _share_host_ = "http://wtest.dongbaoxian.cn";
} else {
  _ajax_host_ = "/api";
  _share_host_ = "http://192.168.43.147:9999";
}

export const ajax_host = _ajax_host_;
export const share_host = _share_host_;