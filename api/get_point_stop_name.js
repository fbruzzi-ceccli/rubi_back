const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");
// const config = require("../config.js");

var con = config.connection; 

router.get('/getpointstopname', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    let id_stop = req.query.id_stop;
    const sql = 'SELECT * FROM PointsPassage INNER JOIN Applications ON PointsPassage.CleDat = Applications.CleDat WHERE PointsPassage.CLeIdt = ? AND Applications.DateActivation <= CURDATE( ) ORDER BY Applications.CleDat DESC LIMIT 1';
    con.query(sql, id_stop, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.send(results)
        } else {
            return res.json([]);
        }
    })
});

module.exports = router;