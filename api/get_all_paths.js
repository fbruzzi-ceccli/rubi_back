const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");
// const config = require("../config.js");

var con = config.connection; 

router.get('/getallpaths', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed


    const sql = 'SELECT CleDat FROM Applications WHERE DateActivation <= CURDATE() ORDER BY CleDat DESC LIMIT 1';
    con.query(sql, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            
            let cledat = results[0].CleDat;

            const sql = "SELECT AttChemin, AttLigne FROM MissionsCourses WHERE CleDat = ?";

            con.query(sql, [cledat], (err, results) => {
                if (err) throw err
                if (results.length > 0) {
                    res.send(results)
                } else {
                    return res.json([cledat]);
                }
            })

        } else {
            return res.json([]);
        }
    })
});

module.exports = router;