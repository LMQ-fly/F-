"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _axios = _interopRequireDefault(require("axios"));

var _vueAxios = _interopRequireDefault(require("vue-axios"));

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

require("lib-flexible/flexible");

var _vant = require("vant");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 引入导航栏
_vue["default"].use(_vant.NavBar).use(_vant.Form).use(_vant.Field).use(_vant.Button).use(_vant.Popup).use(_vant.Tabbar).use(_vant.TabbarItem).use(_vant.Toast).use(_vant.Notify).use(_vant.Swipe).use(_vant.SwipeItem).use(_vant.Search).use(_vant.SubmitBar).use(_vant.SwipeCell).use(_vant.Checkbox).use(_vant.Cell).use(_vant.Stepper).use(_vant.Lazyload).use(_vant.Grid).use(_vant.GridItem).use(_vant.Skeleton).use(_vant.GoodsAction).use(_vant.GoodsActionIcon).use(_vant.GoodsActionButton).use(_vant.CouponCell).use(_vant.CouponList).use(_vant.Dialog).use(_vant.AddressEdit).use(_vant.AddressList).use(_vant.Empty).use(_vant.Icon).use(_vant.Uploader).use(_vant.Tab).use(_vant.Tabs).use(_vant.Card).use(_vant.Tag).use(_vant.image).use(_vant.Rate).use(_vant.Collapse).use(_vant.CollapseItem); // 注册axios,ajax方案,用于请求数据


_vue["default"].use(_vueAxios["default"], _axios["default"]); //设置请求基础路径


_axios["default"].defaults.baseURL = 'http://www.kangliuyong.com:10002'; //设置post请求头

_axios["default"].defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
_vue["default"].config.productionTip = false; //添加一个Vue的原型属性

_vue["default"].prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='; //全局注册过滤器, 一般用于格式化数据

_vue["default"].filter('formatDate', function (value, format) {
  //value: 需要格式化的数据
  //format: 指定格式 yyyy-MM-dd hh:mm:ss
  // 
  var date = new Date(value); //获取年份

  var year = date.getFullYear(); // 

  if (/(y+)/.test(format)) {
    //获取匹配组的内容
    var content = RegExp.$1; // 

    format = format.replace(content, year.toString().slice(4 - content.length)); // 
  }

  var o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (var key in o) {
    //构造动态正则
    var reg = new RegExp("(".concat(key, "+)")); // 

    if (reg.test(format)) {
      //获取匹配组的内容
      var _content = RegExp.$1; // 

      var k = o[key] >= 10 ? o[key] : _content.length == 2 ? '0' + o[key] : o[key]; // 

      format = format.replace(_content, k); // 
    }
  }

  return format;
});

new _vue["default"]({
  router: _router["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount("#app");