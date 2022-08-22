const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");
// const config = require("../config.js");

var con = config.connection; 

router.get('/getvehiculemission', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    let id_mission = req.query.id_mission;
    const sql = 'SELECT NumeroMission FROM Missions INNER JOIN Applications ON Missions.CleDat = Applications.CleDat WHERE Missions.CLeIdt = ? AND Applications.DateActivation <= CURDATE( ) ORDER BY Applications.CleDat DESC LIMIT 1';
    con.query(sql, id_mission, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.send(results)
        } else {
            return res.json([]);
        }
    })
});

module.exports = router;
