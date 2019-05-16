const ENV = process.env.NODE_ENV;
let _ajax_host_ = "";

console.log(`${ENV}`);

if (ENV === "dev") {
  _ajax_host_ = "/api"
} else {
  _ajax_host_ = "/";
}

export const ajax_host = _ajax_host_;