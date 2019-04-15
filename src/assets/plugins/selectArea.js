import $ from "jquery";

var selectArea = function () {
  var _self = this;

  var defaults = {
    areaData: {
      province: {},
      city: {},
      county: {}
    },
    element: {
      box: "#areaDisk",
      animate: "#areaAnimate",
      close: "#areaClose",
      container: "#areaContainer",
      loading: "#areaLoading",
      line: "#animateLine",
      province: "#province",
      city: "#city",
      county: "#county"
    }
  };

  var _result_area_data_ = {
    province: { name: "", code: "" },
    city: { name: "", code: "" },
    county: { name: "", code: "" }
  };

  var areaData = {}, element = {};
  var $box, $animate, $close, $container, $line, $loading;
  var $province, $city, $county;
  var $clickTarget = "";

  //当前选择级别
  var checkRank = 3, _tem_rank_ = 0;
  //切割符号
  var symbolStr = "";
  //结果返回
  var resultHTML = "";
  //回调函数
  var callback = null;

  //省市区当前操作的标签
  var $curTarget = "";

  //是否有数据
  var isAreaData = false;

  //默认触发标签
  var $defClickTarget = $("#areaCheckBtn");

  /**
   * 初始化函数
   * @param option 参数：areaData-地址数据，element-文档节点
   * @returns {jQuery} 函数本身
   */
  _self.init = function (option) {
    var opt = $.extend(true, {}, defaults, option);
    areaData = $.extend(true, {}, defaults.areaData, opt.areaData);
    element = $.extend(true, {}, defaults.element, opt.element);

    $box = $(element.box);
    $animate = $(element.animate);
    $close = $(element.close).on("click", closeDiskBox);
    $container = $(element.container);
    $line = $(element.line);
    $loading = $(element.loading);

    $province = $(element.province).on("click", { type: "p" }, tabCheckAreaFun);
    $city = $(element.city).on("click", { type: "c" }, tabCheckAreaFun);
    $county = $(element.county).on("click", { type: "a" }, tabCheckAreaFun);

    return _self;
  };

  //选择省份
  _self.selectProvince = function (option) {
    _tem_rank_ = checkRank = 1;

    var opt = $.extend(true, {}, option);
    $clickTarget = $(opt.clickTarget) || $defClickTarget;
    var data = $clickTarget.data("addressCode");
    if (!!data) {
      isAreaData = true;
      selectInit(option, true, function () {
        $province.trigger("click");
      });
    } else {
      selectInit(option);
    }
  };

  //选择城市
  _self.selectCity = function (option) {
    _tem_rank_ = checkRank = 2;

    var opt = $.extend(true, {}, option);
    $clickTarget = $(opt.clickTarget) || $defClickTarget;
    var data = $clickTarget.data("addressCode");
    if (!!data) {
      isAreaData = true;
      selectInit(option, true, function (areaName, provinceText, cityText, countyText) {
        $city.addClass("show-modal").removeClass("hide-modal").text(cityText);
        $county.addClass("hide-modal").removeClass("show-modal").text(countyText);

        $city.trigger("click");
      });
    } else {
      selectInit(option);
    }
  };

  //选择区县(默认重庆)
  _self.selectCounty = function (option) {
    _tem_rank_ = checkRank = 3;

    var opt = $.extend(true, {}, option);
    $clickTarget = $(opt.clickTarget) || $defClickTarget;
    var data = $clickTarget.data("addressCode");
    console.log(data);
    if (!!data) {
      isAreaData = true;
      selectInit(option, true, function (areaName, provinceText, cityText, countyText) {
        $city.addClass("show-modal").removeClass("hide-modal").text(cityText);
        $county.addClass("show-modal").removeClass("hide-modal").text(countyText);

        $county.trigger("click");
      });
    } else {
      selectInit(option);
    }
  };

  //选择区县
  // _self.selectCounty = function (option) {
  //     _tem_rank_ = checkRank = 3;
  //
  //     var opt = $.extend(true, {}, option);
  //     $clickTarget = $(opt.clickTarget) || $defClickTarget;
  //     var data = $clickTarget.data("addressCode");
  //     console.log(data);
  //     if (!!data) {
  //         isAreaData = true;
  //         selectInit(option, true, function (areaName, provinceText, cityText, countyText) {
  //             $city.addClass("show-modal").removeClass("hide-modal").text(cityText);
  //             $county.addClass("show-modal").removeClass("hide-modal").text(countyText);
  //
  //             $county.trigger("click");
  //         });
  //     } else {
  //         selectInit(option);
  //     }
  // };

  //通过编码获取省份
  _self.getProvinceName = function (code) {
    var pName = "";
    areaData.province.forEach(function (item) {
      if (item.provinceId === code) {
        pName = item.provinceName;
      } else {
        return false;
      }
    });
    return pName;
  };

  //通过编码获取城市
  _self.getCityName = function (code) {
    var cName = "";
    areaData.city.forEach(function (item) {
      if (item.cityId === code) {
        cName = item.cityName;
      } else {
        return false;
      }
    });
    return cName;
  };

  //通过编码获取区县
  _self.getCountyName = function (code) {
    var cuName = "";
    areaData.county.forEach(function (item) {
      if (item.areaId === code) {
        cuName = item.areaName;
      } else {
        return false;
      }
    });
    return cuName;
  };

  /**
   * 插件执行的初始化函数
   * @param cb
   */
  function init(cb) {
    $loading.show();
    $box.fadeIn();
    $animate.addClass("active");

    setTimeout(function () {
      $loading.hide();
      cb && cb.call($container[0]);
    }, 500);
  }

  /**
   * 选择地址初始化函数
   * @param option
   * symbol：分隔符
   * clickTarget：当前点击目标（方便复制）
   * finishFunction：结束的回调的函数
   * @param hasData 是否有数据
   * @param cb 回调
   */
  function selectInit(option, hasData, cb) {
    var opt = $.extend(true, {}, option);

    symbolStr = opt.symbol || " ";
    callback = opt.finishFunction || returnResultFun;

    init(function () {
      if (!hasData) {
        $province.addClass("show-modal active").removeClass("hide-modal").text("请选择");
        $city.removeClass("show-modal").addClass("hide-modal").text("请选择");
        $county.removeClass("show-modal").addClass("hide-modal").text("请选择");
        lineAnimate($province.width(), $province.offset().left - 30);
        createHTML(areaData.province, "p", callback, false, false);
      } else {
        //通过数据获取
        var dataStr = $clickTarget.data("addressCode");
        var data = JSON.parse(dataStr);
        console.log(data);
        var provinceText = data.province.name;
        var cityText = data.city.name;
        var countyText = data.county.name;
        var provinceCode = data.province.code;
        var cityCode = data.city.code;
        var countyCode = data.county.code;
        $province.data("code", provinceCode);
        $city.data("code", cityCode);
        $county.data("code", countyCode);

        //通过名字获取
        var areaName = $clickTarget.text();
        // var provinceText = areaName.split(symbolStr)[0];
        // var cityText = areaName.split(symbolStr)[1];
        // var countyText = areaName.split(symbolStr)[2];
        // var provinceCode = $province.data("code");
        // var cityCode = $city.data("code");
        // var countyCode = $county.data("code");


        _result_area_data_.province.name = provinceText;
        _result_area_data_.province.code = provinceCode;
        _result_area_data_.city.name = cityText;
        _result_area_data_.city.code = cityCode;
        _result_area_data_.county.name = countyText;
        _result_area_data_.county.code = countyCode;

        $province.text(provinceText);

        cb && cb.call($clickTarget, areaName, provinceText, cityText, countyText);
      }
    })
  }

  /**
   * 选择地址
   * @param e
   * e.data.rankDesc：选择级别的解释：p,c,a
   * e.data.cb：选择地址之后的回调
   */
  function selectAreaItem(e) {
    var rankDesc = e.data.rankDesc;
    var cb = e.data.cb;
    var $this = $(this);
    var $item = $this.find("span");
    var code = $item.data("code").toString();

    var cityData, countyDta;

    $item.addClass("active").parents("li").siblings().find("span").removeClass("active");
    $curTarget.text($item.text()).data("code", code);
    $line.css("width", $curTarget.width() + "px");

    if ((rankDesc === "c" && checkRank === 2) || (rankDesc === "a" && checkRank === 3)) {
      checkRank = isAreaData ? 1 : checkRank;
    }

    $loading.show();
    setTimeout(function () {
      $loading.hide();

      switch (checkRank.toString()) {
        case "1":
          if (rankDesc === "p") {
            _result_area_data_.province.name = $item.text();
            _result_area_data_.province.code = code;
          } else if (rankDesc === "c") {
            _result_area_data_.city.name = $item.text();
            _result_area_data_.city.code = code;
          } else if (rankDesc === "a") {
            _result_area_data_.county.name = $item.text();
            _result_area_data_.county.code = code;
          }
          createHTML(null, null, cb, true, false);
          break;
        case "2":
          if (rankDesc === "p") {
            _result_area_data_.province.name = $item.text();
            _result_area_data_.province.code = code;
          }
          checkRank = 1;
          cityData = getCityAryByPid(code);
          createHTML(cityData, "c", cb, false, false);
          break;
        case "3":
          if (rankDesc === "p") {
            _result_area_data_.province.name = $item.text();
            _result_area_data_.province.code = code;
            cityData = getCityAryByPid(code);
            createHTML(cityData, "c", cb, false, false);
          } else {
            _result_area_data_.city.name = $item.text();
            _result_area_data_.city.code = code;
            checkRank = 1;
            countyDta = getCountyAryByCid(code);
            createHTML(countyDta, "a", cb, false, false);
          }
          break;
      }

      lineAnimate($curTarget.width(), $curTarget.offset().left - 30);
    }, 300);
  }

  //返回最后结果，没有finishFunction回调，将放回数据保存到当前标签上
  function returnResultFun() {
    closeFun(function () {
      $clickTarget.data("result-area", JSON.stringify(_result_area_data_));
    })
  }


  /**
   * 创建html数据
   * @param data  数据
   * @param type  省、市、区（p,c,a）
   * @param cb  选择回调
   * @param finish  是否结束
   * @param isSlide  是否启用swiper
   * @returns {string}
   */
  function createHTML(data, type, cb, finish, isSlide) {
    var _html_ = "", _list_ = "", cont = "";

    if (type === "p") {
      $curTarget = $province;
    } else if (type === "c") {
      $curTarget = $city;
    } else if (type === "a") {
      $curTarget = $county;
    }
    $curTarget.addClass("active show-modal").removeClass("hide-modal").siblings().removeClass("active");

    if (!finish) {
      data.forEach(function (item) {
        switch (type) {
          case "p":
            cont = "<span data-code='" + item.provinceId + "'>" + item.provinceName + "</span>";
            break;
          case "c":
            cont = "<span data-code='" + item.cityId + "'>" + item.cityName + "</span>";
            break;
          case "a":
            cont = "<span data-code='" + item.areaId + "'>" + item.areaName + "</span>";
            break;
        }
        _list_ += isSlide ? "<div class='swiper-slide'>" + cont + "</div>" : "<li>" + cont + "</li>";
      });

      _html_ += isSlide ? "<div class='swiper-container area-swiper'>" : "<div class='overflow'>";
      _html_ += isSlide ? "<div class='swiper-wrapper'>" : "<div class='area-list'>";
      _html_ += isSlide ? _list_ : "<ul>" + _list_ + "</ul>";
      _html_ += "</div>";
      _html_ += "</div>";

      $container.scrollTop(0);
      $container.empty().append(_html_).find("li").on("click", {
        rankDesc: type,
        cb: cb
      }, selectAreaItem);
    } else {
      closeFun(function () {
        resultHTML = _result_area_data_.province.name + symbolStr + _result_area_data_.city.name + symbolStr + _result_area_data_.county.name;
        $clickTarget.data("addressCode", JSON.stringify(_result_area_data_));
        cb && cb.call($container[0], _result_area_data_, resultHTML, symbolStr);
      })
    }

    return _html_;
  }


  //通过省份ID 获取城市数据列表
  function getCityAryByPid(pID) {
    var cityAry = [];
    areaData.city.forEach(function (item) {
      if (item.provinceId === pID) {
        cityAry.push(item);
      }
    });
    return cityAry;
  }

  //通过城市ID 获取区域数据列表
  function getCountyAryByCid(cID) {
    var countyAry = [];
    areaData.county.forEach(function (item) {
      if (item.cityId === cID) {
        countyAry.push(item);
      }
    });
    return countyAry;
  }


  //关闭函数
  function closeFun(callback) {
    $animate.removeClass("active");
    setTimeout(function () {
      $box.fadeOut();
      $container.empty();
    }, 300);
    callback && callback.call($container);
  }

  //关闭窗口
  function closeDiskBox(e) {
    e.stopPropagation();
    $animate.removeClass("active");
    setTimeout(function () {
      $box.fadeOut();
    }, 300);
  }

  //线动画
  function lineAnimate(w, left) {
    $line.css("width", w + "px").animate({ "left": (left + 30) + "px" }, 300, function () {
      $(this).width(w);
    });
  }

  //获取当前文字
  function curAreaClass(text) {
    $container.find("span").each(function () {
      if ($(this).text() === text) {
        $(this).addClass("active");

        var top = $(this).position().top + $container.find(".overflow").scrollTop() - 77 + 15;

        $container.find(".overflow").scrollTop(top);
      }
    });
  }

  //tab选项卡
  function tabCheckAreaFun(e) {
    var type = e.data.type;
    var $this = $(this);
    var code = $this.data("code");
    var pCode = $province.data("code");
    var cCode = $city.data("code");

    console.log(code);
    if (!code) return false;

    checkRank = _tem_rank_;
    $loading.show();
    setTimeout(function () {
      $loading.hide();
      if (type === "p") {
        createHTML(areaData.province, "p", callback, false, false);
        $city.text("请选择");
        $county.addClass("hide-modal").removeClass("show-modal").text("请选择");
      } else if (type === "c") {
        var cityData = getCityAryByPid(pCode);
        createHTML(cityData, "c", callback, false, false);
        $county.text("请选择");
      } else if (type === "a") {
        var countyData = getCountyAryByCid(cCode);
        createHTML(countyData, "a", callback, false, false);
      }

      curAreaClass($this.text());
      lineAnimate($curTarget.width(), $curTarget.offset().left - 30);
    }, 300);
  }
};

// $.extend({
//   checkAddress: new $.area()
// });

export default new selectArea()