var express = require('express');
var router = express.Router();
var dbmgr  = require("../public/db/mdbmgr");

router.post('/update_role_info', function(req, res) {
    dbmgr.updateRoleInfo(req.body, res);
    
});

module.exports = router;
