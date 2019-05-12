import { Base64 } from 'js-base64';

const PASSWORD = "TR_XJQ_999";

const encryption = (str, pwd) => {
  let b = Base64;
  let eStr = b.encode(str);
  let prand = "";

  for (let i = 0; i < pwd.length; i++) {
    prand += pwd.charCodeAt(i).toString();
  }

  let sPos = Math.floor(prand.length / 5);
  let mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
  let incr = Math.ceil(pwd.length / 2);
  let modu = Math.pow(2, 31) - 1;
  if (mult < 2) {
    console.error("请选择更复杂或更长的密码.");
    return null;
  }
  let salt = Math.round(Math.random() * 1000000000) % 100000000;
  prand += salt;
  while (prand.length > 10) {
    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
  }
  prand = (mult * prand + incr) % modu;
  let enc_chr = "";
  let enc_str = "";
  for (let i = 0; i < eStr.length; i++) {
    enc_chr = parseInt(eStr.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
    if (enc_chr < 16) {
      enc_str += "0" + enc_chr.toString(16);
    } else enc_str += enc_chr.toString(16);
    prand = (mult * prand + incr) % modu;
  }
  salt = salt.toString(16);
  while (salt.length < 8) salt = "0" + salt;
  enc_str += salt;
  return enc_str;
}

const decryption = (str, pwd) => {
  let b = Base64;
  let prand = "";
  for (let i = 0; i < pwd.length; i++) {
    prand += pwd.charCodeAt(i).toString();
  }
  let sPos = Math.floor(prand.length / 5);
  let mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
  let incr = Math.round(pwd.length / 2);
  let modu = Math.pow(2, 31) - 1;
  let salt = parseInt(str.substring(str.length - 8, str.length), 16);
  str = str.substring(0, str.length - 8);
  prand += salt;
  while (prand.length > 10) {
    prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
  }
  prand = (mult * prand + incr) % modu;
  let enc_chr = "";
  let enc_str = "";
  for (let i = 0; i < str.length; i += 2) {
    enc_chr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));
    enc_str += String.fromCharCode(enc_chr);
    prand = (mult * prand + incr) % modu;
  }
  return b.decode(enc_str);
}



/**
 * 并发ajax请求
 * @param {Object} vue  vue对象
 */
const ajaxParataxisData = async (vue, ...arg) => {
  let loading = vue.$jBox.loading("获取中...");
  return new Promise(async (resolve, reject) => {
    try {
      let funs = [...arg].map(item => {
        if ((typeof item) !== "function") {
          return item;
        }
        return item();
      })

      await Promise.all(funs)
        .then(data => {
          vue.$jBox.closeById(loading, () => {
            resolve(data);
          });
        })
        .catch(e => {
          vue.$jBox.closeById(loading, () => {
            reject(e);
          });
        });

    } catch (err) {
      console.error(err);
      vue.$jBox.closeById(loading, () => {
        vue.$jBox.error("网络服务异常");
      });
    }
  })
}

/**
 * 分步骤返回并发数据
 * @param {*} vue 
 * @param {Array} ary [{fun:Function, callback:Funciton}] 
 */
const ajaxParataxisDataStep = async (vue, ary) => {
  return new Promise(async (resolve, reject) => {
    let loading = vue.$jBox.loading("获取中...");
    try {
      let reuslt = [];
      for (let i = 0, len = ary.length; i < len; i++) {
        let data = await ary[i].fun;
        ary[i].callback && ary[i].callback.call(this, data);
        reuslt.push(data);
      }

      vue.$jBox.closeById(loading, () => {
        resolve(reuslt)
      });

    } catch (err) {
      console.error(err);
      vue.$jBox.closeById(loading, () => {
        vue.$jBox.error("网络服务异常");
        reject(err)
      });
    }
  });
}

const GLOBAL = {
  encryption: (str, pwd) => {
    return encryption(str, pwd)
  },
  decryption: (str, pwd) => {
    return decryption(str, pwd)
  },
  setItem: (key, value) => {
    localStorage.setItem(Base64.encode(key), GLOBAL.encryption(value, PASSWORD));
  },
  getItem: (key) => {
    let eKey = Base64.encode(key);
    return !!localStorage.getItem(eKey) ? GLOBAL.decryption(localStorage.getItem(eKey), PASSWORD) : "";
  },
  set: (obj) => {
    for (let key in obj) {
      localStorage.setItem(Base64.encode(key), GLOBAL.encryption(obj[key], PASSWORD));
    }
  },
  get: (obj) => {
    let result = {};
    for (let key in obj) {
      let eKey = Base64.encode(obj[key]);
      if (!!eKey) {
        result[key] = !!localStorage.getItem(eKey) ? GLOBAL.decryption(localStorage.getItem(eKey), PASSWORD) : "";
      } else {
        result[key] = "";
      }
    }
    return result;
  },
  remove: (key) => {
    localStorage.removeItem(Base64.encode(key));
  },
  ajaxParataxisData,
  ajaxParataxisDataStep
};

//开发测试
window.__G__ = GLOBAL;

export default GLOBAL;