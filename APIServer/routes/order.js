var express = require('express');
var router = express.Router();
var mdbmgr = require('../public/db/mdbmgr');
var globalwww = require('../bin/www');
var wmdat     = require('../public/data/wmdata');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('order', { title: '霞姐外卖', addrs: wmdat.addrs, cates:wmdat.cates, allname:wmdat.names});
});

var getcontent = function(jsondata) {
  var addrs = wmdat.addrs;
  var addr = addrs[jsondata.select_addr - 1];
  var categorys = wmdat.cates;
  var cate = categorys[jsondata.select_category  - 1];
  var content = addr + 
    jsondata.select_name + " " +
    cate + " " +
    jsondata.food_num + "份, 米饭 " +
    jsondata.rice_num + ", 馒头"  +
    jsondata.mantou_num + "份";
  return content;
};


var  sendDataToClient = function(jsondata, res) {
  var content = getcontent(jsondata);
  jsondata.select_category = wmdat.cates[jsondata.select_category - 1];
  jsondata.select_addr = wmdat.addrs[jsondata.select_addr -1 ];
  console.log(jsondata)
  globalwww.sendMess(jsondata);
  res.render('ordersuccess',{content: content});
}

router.post('/confirm', function(req, res, next) {
  console.log(req.body);
  

  mdbmgr.addOrderInfo(req.body,res, sendDataToClient);
  

});

router.get('/getlist', function(req, res, next) {
  //mdbmgr.getOrderList(res);
  res.render("orderlist");
});

router.get('/getlistdata', function(req, res, next){
  mdbmgr.getOrderListData(res);
});

module.exports = router;