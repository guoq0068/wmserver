var express = require('express');
var router = express.Router();


var mysqlpool = require('../public/javascripts/mysqlpool');


/* GET users listing. */
router.get('/', function(req, res, next) {

  mysqlpool.query("select * from user_type;", null , function(err, rows, fields){
    
    if(err) { 
      res.status(500);
      res.send(err);
    }
    else {
       res.send(JSON.stringify(rows));
    }
    

  })

  
});

module.exports = router;
