var express = require('express');
var router = express.Router();
var mdbmgr = require('../public/db/mdbmgr');
var globalwww = require('../bin/www');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('order', { title: '霞姐外卖' });
});

var getcontent = function(jsondata) {
  var addrs = ["4号楼", "9号楼", "乐天新玛特"];
  var addr = addrs[jsondata.select_addr - 1];
  var categorys = ["1荤1素", "2荤1素"];
  var cate = categorys[jsondata.select_category  - 1];
  var content = addr + 
    jsondata.select_name + " " +
    cate + " " +
    jsondata.food_num + "份, 米饭 " +
    jsondata.rice_num + ", 馒头"  +
    jsondata.mantou_num + "份";
  return content;
};

router.post('/confirm', function(req, res, next) {
  var content = getcontent(req.body);
  console.log(content);
  console.log(req.body,"body");
  mdbmgr.addOrderInfo(req.body);
  globalwww.sendMess(req.body);
  res.render('ordersuccess',{content: content});
});

router.get('/getlist', function(req, res, next) {
  //mdbmgr.getOrderList(res);
  res.render("orderlist");
});

router.get('/getlistdata', function(req, res, next){
  mdbmgr.getOrderListData(res);
});

module.exports = router;