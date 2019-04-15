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
  return num;
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
 * 获取当前时间
 * @param type
 * @returns {string}
 */
FB.getNowTime = (type) => {
  let myDate = new Date();
  let year = myDate.getFullYear();
  let month = myDate.getMonth() + 1;
  let date = myDate.getDate();
  let h = myDate.getHours();
  let m = myDate.getMinutes();
  let s = myDate.getSeconds();

  switch (type) {
    case "timeAll":
      return zero(h, 2) + ':' + zero(m, 2) + ":" + zero(s, 2);
    case "date":
      return year + '-' + zero(month, 2) + "-" + zero(date, 2);
    case "timeSimple":
      return zero(h, 2) + ':' + zero(m, 2);
    case "timeString":
      return year + zero(month, 2) + zero(date, 2) + zero(h, 2) + zero(m, 2) + zero(s, 2);
    default:
      return year + '-' + zero(month, 2) + "-" + zero(date, 2) + " " + zero(h, 2) + ':' + zero(m, 2) + ":" + zero(s, 2);
  }
};

/**
 * 获取当前时间相关信息
 * @returns {Funciton}
 */
FB.getNowTime = () => {
  let myDate = new Date();
  let year = myDate.getFullYear();
  let month = myDate.getMonth() + 1;
  let date = myDate.getDate();
  let h = myDate.getHours();
  let m = myDate.getMinutes();
  let s = myDate.getSeconds();

  return {
    getYear: () => {
      return year;
    },
    getMonth: () => {
      return month;
    },
    getDate: () => {
      return date;
    }
  }
};


/**
 * 通过毫秒计算时间
 * @param time
 * @param type
 * @returns {string}
 */
FB.getDateByTime = (time, type) => {
  let myDate = new Date(time);
  let year = myDate.getFullYear();
  let month = myDate.getMonth() + 1;
  let date = myDate.getDate();
  let h = myDate.getHours();
  let m = myDate.getMinutes();
  let s = myDate.getSeconds();

  switch (type) {
    case "timeAll":
      return zero(h, 2) + ':' + zero(m, 2) + ":" + zero(s, 2);
    case "date":
      return year + '-' + zero(month, 2) + "-" + zero(date, 2);
    case "timeSimple":
      return zero(h, 2) + ':' + zero(m, 2);
    case "timeSting":
      return year + zero(month, 2) + zero(date, 2) + zero(h, 2) + zero(m, 2) + zero(s, 2);
    default:
      return year + '-' + zero(month, 2) + "-" + zero(date, 2) + " " + zero(h, 2) + ':' + zero(m, 2) + ":" + zero(s, 2);
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
 * @msg: 简易tab选项卡
 * @param beforeEnd {} 切换之前方法
 * @return: 
 */
FB.tabBox = (selector, selectCallBack) => {
  let id = selector.split("|")[0];
  let name = selector.indexOf("|") > -1 ? selector.split("|")[1] : "";
  let $ele = $(id);
  let $tabNav, $tabNavItme, $tabContent, $tabLine;
  let _tabWidth, _tabLeft, _tabPadLeft, _tabPadRight;

  $tabNav = $(".tab-nav[name='" + name + "']");
  $tabContent = $(".tab-content[name='" + name + "']");

  $tabLine = $tabNav.find(".tab-line");
  // $tabNavItme = $tabNav.find(".item");
  // _tabWidth = $tabNavItme.outerWidth(true);
  // _tabLeft = $tabNavItme.position().left;
  // _tabPadLeft = parseInt($tabNavItme.css("padding-left"));
  // _tabPadRight = parseInt($tabNavItme.css("padding-right"));

  $tabLine.each(function () {
    $tabNavItme = $(this).parents(".tab-nav").find(".item");
    _tabWidth = $tabNavItme.outerWidth(true);
    _tabLeft = $tabNavItme.position().left;
    _tabPadLeft = parseInt($tabNavItme.css("padding-left"));
    _tabPadRight = parseInt($tabNavItme.css("padding-right"));
    $(this).css({
      width: _tabWidth - _tabPadLeft - _tabPadRight,
      left: _tabLeft + _tabPadLeft
    });
  })

  $tabNav.find(".item").each(function (i) {
    let _name = $(this).attr("name");
    $tabContent.find(".pane-item").eq(i).attr("id", "pane-" + _name);
  });

  $tabNav.find(".item").click(function () {
    if ($(this).hasClass("active")) return false;
    let _name = $(this).attr("name");
    let _index = $(this).index();
    // let _offsetLeft = $(this).position().left;
    // let _tabPadLeft = parseInt($(this).css("padding-left"));

    if ($(this).hasClass("disabled")) {
      selectCallBack && selectCallBack.call(this, _name);
      return false;
    }

    $tabLine.each(function () {
      let _offsetLeft = $(this).parents(".tab-nav").find(".item").eq(_index).position().left;
      let _tabPadLeft = parseInt($(this).parents(".tab-nav").find(".item").eq(_index).css("padding-left"));
      $(this).animate({ left: _offsetLeft + _tabPadLeft }, 300, function () {
        selectCallBack && selectCallBack.call(this, _name);
        //$("#pane-" + _name).addClass("active").siblings().removeClass("active");
      });
    });
  });
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
}

FB._ = _;

window.__FB__ = FB;
export default FB;
