const ENV = process.env.NODE_ENV;
let _ajax_host_ = "", _share_host_ = "";

console.log(`${ENV}`);

if (ENV === "prod") {
  _ajax_host_ = "http://money.tongrong365.com";
  _share_host_ = "http://money.tongrong365.com";
} else if (ENV === "test") {
  _ajax_host_ = "http://money.test.tongrong365.net";
  _share_host_ = "http://money.test.tongrong365.net";
} else {
  _ajax_host_ = "/api";
  _share_host_ = "http://10.55.110.211:9999";
}

export const ajax_host = _ajax_host_;
export const share_host = _share_host_;