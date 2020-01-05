var express     = require('express');
var router      = express.Router();
var https       = require("https");
var request     = require("request");
var querystring = require("querystring");
var url         = require('url');
var wxconfig    = require('../public/javascripts/config');
var crypto      = require('crypto');
var WXBizDataCrypt  = require('../public/javascripts/WXBizDataCrypt');
var dbmgr           = require('../public/db/mdbmgr');

/*
 微信push验证
 */
router.get('/push', function(req, res, next) {

    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
  
    /*  加密/校验流程如下： */
    //1. 将token、timestamp、nonce三个参数进行字典序排序
    var array = new Array(token,timestamp,nonce);
    array.sort();
    var str = array.toString().replace(/,/g,"");
  
    //2. 将三个参数字符串拼接成一个字符串进行sha1加密
    var sha1Code = crypto.createHash("sha1");
    var code = sha1Code.update(str,'utf-8').digest("hex");
  
    //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if(code===signature){
        res.send(echostr)
    }else{
        res.send("error");
    }
});

/*
  微信小程序登录
  req: getuserinfo的加密数据
  返回：解密出的数据，openid,
 */
router.get('/login', function(req, res, next) {
    var arg = url.parse(req.url, true ).query;
    var iv  = arg.iv;
    var encryptedData = arg.encryptedData;
    var mres = res;

    var data = {
        appid : wxconfig.appid,
        secret : wxconfig.secretid,
        js_code : arg.code,
        grant_type : "authorization_code"
    };

    var content = querystring.stringify(data);

    content = "https://api.weixin.qq.com/sns/jscode2session?" + content;

    var options = {
        method : 'get',
        url : content
    };

    request(options, function(err,  res, body) {
        if(err) {
            console.log(err);
            mres.send(err);
            return;
        }
        if(res) {
            var data = JSON.parse(body);
            var session_key = data.session_key;
            console.log(session_key);
            var pc = new WXBizDataCrypt(wxconfig.appid, session_key);

            var data = pc.decryptData(encryptedData, iv);
            console.log(data);
            dbmgr.updateUserInfo(data);
            dbmgr.getRole(data, mres);
        }
    });

})

module.exports = router;