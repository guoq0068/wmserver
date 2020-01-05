var mysqlpool = require("../javascripts/mysqlpool");

var updateUserInfo = function(jsonData) {
    var openid      = jsonData.openId;
    var nickName    = jsonData.nickName;
    var avatarUrl   = jsonData.avatarUrl;
    var unionId     = jsonData.unionId;
    
    if(typeof(unionId) == 'undefined') {
        unionId = '0';
    }
    var queryString = "select * from user_info where openid = '" + openid + "';";
    console.log(queryString);
    
    mysqlpool.query(queryString, null, function(err, result, fields) {
        if(err) {
            console.log(err);
            return err;
        }
        //如果结果为空，则插入数据
        if(result.length == 0 ) {
            queryString = 'insert into user_info(openid, nickname, avatarurl, unionid) values('
                        + '"' + openid + '",'
                        + '"' + nickName + '",'
                        + '"' + avatarUrl + '",'
                        + '"' + unionId + '"'
                        + ');';
            console.log(queryString);                        
            mysqlpool.query(queryString, null, function(err, result, fields){

            });
        }
    });
};


var updataeRoleInfo = function(jsonData, mres) {
    var openid = jsonData.openid;
    var roleid = jsonData.roleid;

    var res = mres;

    var querystring = 'update user_info set user_type = ' 
                    + '"' + roleid + '" where openid like "'
                    + openid + '"';

    mysqlpool.query(querystring, null, function(err, result, fields) {
        if(err) {
            res.status = 500;
            res.send(err);
            return;
        }
        console.log(result);
        res.send("update success");
        return; 
    })
};


var getRole = function(jsonData, mres) {
    var openid = jsonData.openId;

    var res = mres;
    //var queryString = "select * from user_info where openid like '" + openid +"';";
    var queryString = "select openid,user_type, nickname,company_name, user_company_info.role_id from user_info, "
      + "user_company_info, custom_company_info where openid = '" + openid + 
      "' and user_info.nickname = user_company_info.wx_nickname  " + 
      "and user_company_info.`company_id` = custom_company_info.`id`;";

      console.log("sql is " + queryString);
    
    mysqlpool.query(queryString, null, function(err, result,fields){
        console.log("err is " + err);
        if(err) {
            
            res.status = 500;
            res.send(err);
            return;
        } 
        console.log(result);
        if(result.length > 0) {
            var user_type       = result[0]['user_type'];
            var company_name    = result[0]['company_name'];
            var roleid          =  result[0]['role_id'];
            jsonData.userType = user_type;
            jsonData.companyName = company_name;
            jsonData.roleid = roleid;
            console.log(jsonData);

        }      
        res.send(jsonData);
    })
};

/**
 * 获取当天的外卖列表
 */
var getOrderList = function(res) {
    var querystring = "select * from wm_order where order_time > date_format(now(), '%Y-%m-%d') ";
    mysqlpool.query(querystring, null, function(err, result,fields){
        console.log("err is " + err);
        if(err) {
            
            res.status = 500;
            res.send(err);
            return;
        } 
        console.log(result);
     
        res.render('orderlist', {results: result, addrs:["4号楼","9号楼","乐天玛特"], cates:["1荤1素","2荤1素"]});
    });
}

var getOrderListData = function(res) {
    var querystring = "select * from wm_order where order_time > date_format(now(), '%Y-%m-%d') ";
    mysqlpool.query(querystring, null, function(err, result,fields){
        console.log("err is " + err);
        if(err) {
            
            res.status = 500;
            res.send(err);
            return;
        } 
        console.log(result);
     
        res.send(JSON.stringify(result));
    }); 
}

/**
 * 
 * @param {*} jsonData 
 */

var addOrderInfo = function(jsonData) {

    var timestamp = Date.now();
    var querystring = " insert into wm_order " +
    " (addr_id, name, order_category, food_num, rice_num, mantou_num) values(" +
    jsonData.select_addr + ",'" +
    jsonData.select_name + "', " +
    jsonData.select_category + ", " +
    jsonData.food_num + ", " +
    jsonData.rice_num + ", "  +
    jsonData.mantou_num + ")";

    console.log(querystring);

    mysqlpool.query(querystring, null, function(err, result,fields){
        console.log("err is " + err);
    });
    


};

module.exports = {
    updateUserInfo : updateUserInfo,
    updateRoleInfo : updataeRoleInfo,
    getRole : getRole,
    addOrderInfo    : addOrderInfo,
    getOrderList : getOrderList,
    getOrderListData: getOrderListData
}