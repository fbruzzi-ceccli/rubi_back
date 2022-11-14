const express = require("express");
const router = express.Router();
const config = require("../config_DBRT.js");

var con = config.connection; 

router.get('/getPredPass', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const sql = 'SELECT AttChm, AttLig, AttVhc, AttPnt FROM PredPass AS pr WHERE pr.Predic = -1 AND pr.AttVhc != 0';

    con.query(sql, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send([]);
        }
    })
});

module.exports = router;