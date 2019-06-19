'use strict'
import _ from 'lodash';
import $ from 'jquery';
const FB = {};

const verifyExp = {
  telephone: /^(1[0-9]{10})$/,
  strengthA: {
    number: /^[0-9]+$/,
    letterCaps: /^[A-Z]+$/,
    letterLows: /^[a-z]+$/,
    symbol: /^\W+$/
  },
  strengthB: {
    numLetterA: /^(([0-9]+[a-z]+)|([a-z]+[0-9]+))[0-9a-z]*$/,
    numLetterB: /^(([0-9]+[A-Z]+)|([A-Z]+[0-9]+))[0-9A-Z]*$/,
    numLetterC: /^(\d|[a-zA-Z]|\W)*((\d[a-zA-Z]+)|([a-zA-Z]\d+|[a-zA-Z]\d\W*))+(\d|[a-zA-Z]|\W)*$/,
    numSymbol: /^((\W+[0-9]+)|([0-9]+\W+))[\W0-9]*$/,
    LetterALetterB: /^(([A-Z]+[a-z]+)|([a-z]+[A-Z]+))[A-Za-z]*$/,
    LetterASymbol: /^((\W+[a-z]+)|([a-z]+\W+))[\Wa-z]*$/,
    LetterBSymbol: /^((\W+[A-Z]+)|([A-Z]+\W+))[\WA-Z]*$/
  }
};

FB.verifyExp = verifyExp;

/**
 * 补零
 * @param num 补零的数字
 * @param n 补零的位数
 * @returns {String}   补零之后的字符
 */
const zero = FB.zero = (num, n) => {
  let len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num.toString();
};

/**
 * 提取字符串中的小数
 * @param str
 * @returns {String}
 */
FB.numberStr = (str) => {
  let leftStr = str.split(".")[0];
  let rightStr = str.split(".").slice(1).join(".");
  let integer = leftStr.replace(/[^0-9]/ig, "");
  let float = rightStr.replace(/[^0-9]/ig, "");
  let newNum = !!float ? integer + "." + float : integer;
  return newNum;
};

/**
 * 查找某个字符在字符串中出现的个数
 * @param char  某个字符
 * @param str  整个字符串
 * @returns {String} 
 */
FB.findStrPatch = (char, str) => {
  let reg = eval("/\\" + char + "/ig");
  return str.match(reg).length;
}

/**
 * 获取页面URL中的参数
 * @param name
 * @returns {null}
 */
FB.getQueryString = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r !== null) return decodeURI(r[2]);
  return null;
};

/**
 * 通过毫秒计算时间
 * @param time
 * @param type
 * @param split
 * @returns {string}
 */
FB.getDateByTime = (time, type, split) => {
  let _date_ = new Date(time);
  let year = _date_.getFullYear();
  let month = _date_.getMonth() + 1;
  let date = _date_.getDate();
  let h = _date_.getHours();
  let m = _date_.getMinutes();
  let s = _date_.getSeconds();

  switch (type) {
    case "hour":
      return `${zero(h, 2)}:${zero(m, 2)}`;
    case "time":
      return `${zero(h, 2)}:${zero(m, 2)}:${zero(s, 2)}`;
    case "date":
      return `${year}-${zero(month, 2)}-${zero(date, 2)}`;
    case "dateStr":
      return `${year}年${zero(month, 2)}月${zero(date, 2)}日`;
    case "dateSplit":
      return `${year}${split}${zero(month, 2)}${split}${zero(date, 2)}`;
    case "timestamp":
      return time;
    default:
      return `${year}-${zero(month, 2)}-${zero(date, 2)} ${zero(h, 2)}:${zero(m, 2)}:${zero(s, 2)}`;
  }
};

/**
 * 格式化货币
 * @param number
 * @param places
 * @param symbol
 * @param thousand
 * @param decimal
 * @returns {string}
 */
FB.moneyFormat = (number = 0, places = 2, symbol = "", thousand = ",", decimal = ".") => {
  let negative = number < 0 ? "-" : "";
  let i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "";
  let j = i.length;
  j = j > 3 ? j % 3 : 0;
  return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};


/**
 * 小写金额转换成大写金额
 * @param {Number/String} n 需要转换的小写金额
 * @return {String}
 */
FB.moneyNumToCapital = (n) => {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return "数据非法";
  let unit = "千百拾亿千百拾万千百拾元角分", str = "";
  n += "00";
  let p = n.indexOf('.');
  if (p >= 0) {
    n = n.substring(0, p) + n.substr(p + 1, 2);
  }
  unit = unit.substr(unit.length - n.length);
  for (let i = 0; i < n.length; i++) {
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
  }
  return str.replace(/零([千百拾角])/g, "零").replace(/(零)+/g, "零").replace(/零([万亿元])/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
};


/**
 * 计算精度 
 * add(+),sub(-),mul(*),div(/)
 * @param {Number/String} arg1
 * @param {Number/String} arg2
 * @returns {Number}
 */
FB.count = {
  add: (arg1, arg2) => {
    let r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m
  },
  sub: (arg1, arg2) => {
    let r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
  },
  mul: (arg1, arg2) => {
    let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
      m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  },
  div: (arg1, arg2) => {
    let t1 = 0, t2 = 0, r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length
    } catch (e) {
    }
    try {
      t2 = arg2.toString().split(".")[1].length
    } catch (e) {
    }

    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return FB.count.mul((r1 / r2), Math.pow(10, t2 - t1));
  }
};

/**
 * 验证密码强度
 * @param {string} val
 * @param {object} options
 */
FB.verifyPassword = (val, options) => {
  var defaults = {
    isSimple: true,    //开启简单密码检验
    isCaps: true,  //开启键盘大写验证
    isShift: false,   //开启Shift按键验证
    showTag: true, //开启小tag提示
    minLength: 6,
    simpleLength: 6,
    strongLength: 12,
    nullText: "密码不能为空！",
    lengthLess: "密码不能小于6位！",
    successText: "设置密码成功！",
    errorText: "设置密码失败！",
    capsText: "注意：键盘大写锁定已打开，请注意大小写！",
    shiftText: "注意：您按住了Shift键",
    normalTips: "密码由6-20位数字和字符组合",
    psdSimple: "密码太简单，有被盗风险，请换复杂的密码组合！"
  };
  var opt = $.extend({}, defaults, options);
  var l = val.toString().length;
  var resultOPT = {};
  if (l === 0) {
    resultOPT.type = 0;
    resultOPT.text = opt.nullText;
  } else if (l < opt.minLength) {
    resultOPT.type = 0;
    resultOPT.text = opt.lengthLess;
  } else {
    if (eval(FB.verifyExp.strengthA.number).test(val) || eval(FB.verifyExp.strengthA.letterCaps).test(val) || eval(FB.verifyExp.strengthA.letterLows).test(val) || eval(FB.verifyExp.strengthA.symbol).test(val)) {
      //单纯字母，数字，特殊字符
      resultOPT.type = 1;
      resultOPT.text = opt.normalTips;
    } else if (eval(FB.verifyExp.strengthB.numLetterC).test(val)) {
      //符合数字+字符，可选特殊字符
      resultOPT.type = 2;
      resultOPT.text = opt.successText;
    } else {
      //不符合数字+字符
      resultOPT.type = 3;
      resultOPT.text = opt.normalTips;
    }
  }
  //回调
  resultOPT.options = opt;
  return resultOPT;
};


/**
 * @msg: 简易循环轮播
 * @param {type} 
 * @return: 
 */
FB.slideBox = (id, options) => {
  let defaults = {
    direction: "top",
    loop: true,
    speed: 3000,
    number: "1",
    type: "slide" //"marquee"
  };
  let opt = _.extend({}, defaults, options);

  let $this = $(id);
  let $child = $this.find("li");
  let _isLoop = opt.loop;
  let _length = $child.length;
  let item_height = $child.outerHeight(true);
  let item_width = $child.outerWidth(true);
  let direction = opt.direction.toString().toLowerCase();
  let cssName = "", cssProp = "", cssItem = "", dir = 1, current = 0;

  if (direction === "top" || direction === "bottom") {
    cssName = "top";
    cssItem = item_height;
    cssProp = -cssItem * opt.number;
    dir = 1;
    if (direction === "bottom") {
      dir = -1;
    }
  } else {
    cssName = "left";
    cssItem = item_width;
    cssProp = -cssItem * opt.number;
    dir = 1;
    if (direction === "right") {
      dir = -1;
    }
  }

  if (_isLoop) {
    cloneHtml($this, $child, opt.number, "append");
    cloneHtml($this, $child, opt.number, "prepend");
    $this.css(cssName, cssProp);
  }

  let $clone = $this.find("li");
  let item_length = $clone.length;

  let child_lenth = _isLoop ? item_length : _length;


  const moving = () => {
    let initSite = parseInt($this.css(cssName));
    if (opt.type === "marquee") {
      let moveSite = dir === 1 ? --initSite : ++initSite;
      $this.stop(true, true).animate({ [cssName]: moveSite }, 0, function () {
        if (Math.abs(initSite) >= (child_lenth - 1) * cssItem) {
          $this.css(cssName, cssProp);
        } else if (initSite >= 0) {
          $this.css(cssName, cssItem * _length * -1 + "px");
        }
      });
    } else if (opt.type === "slide") {
      let moveDir = dir == 1 ? -1 : 1;
      dir === 1 ? current++ : current--;

      $this.stop(true, true).animate({ [cssName]: cssItem * opt.number * dir * (current + 1) * moveDir }, 500, function () {
        if (current === _length) {
          $this.css(cssName, cssProp);
          current = 0;
        } else if (current < 0) {
          $this.css(cssName, cssItem * _length * -1);
          current = _length - 1;
        }
      });
    }

  }

  let _timer_ = "";
  clearInterval(_timer_);
  _timer_ = setInterval(moving, opt.speed);

  return {
    stop: () => {
      clearInterval(_timer_);
    },
    reset: () => {
      clearInterval(_timer_);
      _timer_ = setInterval(moving, opt.speed);
    }
  };
};

/**
 * @msg: 克隆元素
 * @param container {String} 
 * @param tagEle {jQuery Object/String} 
 * @param cloneNum {Number} 
 * @param type {String} 
 * @return: 
 */
const cloneHtml = (container, tagEle, cloneNum, type) => {
  if (!!cloneNum) {
    for (let i = 0; i < cloneNum; i++) {
      if (type === "append") {
        $(container).append(tagEle.eq(i).clone().addClass("clone"));
      } else if (type === "prepend") {
        $(container).prepend(tagEle.eq(tagEle.length - 1 - i).clone().addClass("clone"));
      }
    }
  } else {
    return tagEle.clone()
  }
};

/**
 * 验证是否是微信浏览器
 */
FB.isWeiXin = () => {
  let result = false;
  let browser = {
    versions: function () {
      let u = navigator.userAgent, app = navigator.appVersion;

      // 移动终端浏览器版本信息
      return {
        trident: u.indexOf('Trident') > -1, // IE内核
        presto: u.indexOf('Presto') > -1, // opera内核
        webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
        iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, // 是否iPad
        webApp: u.indexOf('Safari') == -1 // 是否web应该程序，没有头部与底部
      };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  };

  if (browser.versions.mobile) {// 判断是否是移动设备打开。browser代码在下面
    var ua = navigator.userAgent.toLowerCase();// 获取判断用的对象
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      result = true;
    } else {
      result = false;
    }
  } else {
    result = false;
  }

  return result;
};

/**
 * 返回某年某月的天数
 * @param date 年月：2019-03
 * @returns {String} 当月的天数
 */
FB.getCountDays = (date) => {
  let curDate = new Date(date);
  let curMonth = curDate.getMonth();
  curDate.setMonth(curMonth + 1);
  curDate.setDate(0);
  return curDate.getDate();
}

/**
 * 返回年月日
 * @param start 开始年份
 * @param end 结束年份
 * @returns {Object} 
 */
FB.getFormatYMD = ({ start = 1950, end = new Date().getFullYear(), dayL = 31 } = {}) => {
  let years = [],
    months = [],
    days = [];
  for (let yI = start, yL = end; yI <= yL; yI++) {
    years.push({
      code: yI.toString(),
      text: yI.toString()
    });
  }
  for (let mI = 1, mL = 12; mI <= mL; mI++) {
    months.push({
      code: zero(mI, 2),
      text: zero(mI, 2)
    });
  }
  for (let dI = 1, dL = dayL; dI <= dL; dI++) {
    days.push({
      code: zero(dI, 2),
      text: zero(dI, 2)
    });
  }

  return { years, months, days }
};

/**
 * 根据传入值返回在数组的位置
 * @param value  某个字符
 * @param arr  数组
 * @param fields  数组中判断依据的字段
 * @returns {Number} 
 */
FB.getArrayIndexByVal = (value, arr, fields = 'id') => {
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    if (!!item[fields]) {
      if (item[fields] === value) {
        return i;
      }
    } else {
      if (item === value) {
        return i;
      }
    }
  }

  return -1;
}

/**
 * 根据传入Id返回对应的值
 * @param id  id
 * @param arr  数组
 * @param fields  数组中判断依据的字段
 * @param rFields  数组中判断依据的字段返回想要的字段
 * @returns {String} 
 */
FB.getArrayValueById = (id, arr, fields = 'code', rFields = 'text') => {
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    if (item[fields] !== null || item[fields] !== undefined) {
      if (item[fields] === id) {
        return item[rFields];
      }
    } else {
      if (item === id) {
        return item[rFields];
      }
    }
  }

  return "";
}

/**
 * 通过省份ID获取城市列表
 * @param {String} pId  省份ID
 * @param {Array} city  城市数组
 * @returns {Array} 返回城市数组的数据
 */
FB.getCityData = (pId, city) => {
  let cityAry = [];
  city.map(item => {
    if (item.provinceId === pId) {
      cityAry.push(item)
    }
  })

  return cityAry;
};

/**
 * 通过城市ID获取区县列表
 * @param {String} cId  城市ID
 * @param {Array} county  区县数组
 * @returns {Array} 返回区县数组的数据
 */
FB.getCountyData = (cId, county) => {
  let countyAry = [];
  county.map(item => {
    if (item.cityId === cId) {
      countyAry.push(item)
    }
  })

  return countyAry;
};

/**
 * 格式化picker选择数据
 * @param {Array} data  数据源
 * @param {String} text  替换的文本
 * @param {String} code  替换的code
 * @returns {Array} 返回改造后的数据
 */
FB.formatPickerData = (data, text, code) => {
  data.map(item => {
    item['text'] = item[text];
    item['code'] = item[code];
  })

  return data;
};


/**
 * 身份证出生日格式
 * @param {String} val  数据源
 * @param {Boolean} ary  是否是数组
 * @param {String} split  格式化
 * @returns {String} 日期格式
 */
FB.formatBirthdayData = (val, ary = false, split = "-") => {
  let y = val.substring(0, 4);
  let m = val.substring(4, 6);
  let d = val.substring(6, 8);
  if (ary) {
    return [y, m, d];
  } else {
    return `${y}${split}${m}${split}${d}`;
  }
};

/**
 * 切割银行卡号
 * @param {String} number  数据源
 * @param {String} split  格式化
 * @returns {String} 日期格式
 */
FB.formatBankNoData = (number, split = "*") => {
  let length = number.length;
  let reg = /^(\d{4})\d+(\d{4})$/;
  let str = "";
  for (let i = 0; i < length - 8; i++) {
    str += split;
  }
  return number.replace(reg, `$1${str}$2`)
};

/**
 * 验证是否是数组
 * @param {Array} ary  数据源
 * @returns {Boolean} 
 */
FB.isArray = (ary) => {
  return Object.prototype.toString.call(ary) === "[object Array]"
}

FB._ = _;

window.__FB__ = FB;
export default FB;
