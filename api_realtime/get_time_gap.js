const express = require("express");
const router = express.Router();
const config = require("../config_DBRT.js");
// const config = require("../config.js");

var con = config.connection; 

router.get('/gettimegap', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    let vehicule_id = req.query.vehicule_id;
    let id_mission = req.query.id_mission;
    let course_mission = req.query.course_mission;

    const sql = 'SELECT DISTINCT Decalg FROM PredPass WHERE AttVhc = ? AND AttMss = ? AND SqCMss = ?';
    con.query(sql, [vehicule_id, id_mission, course_mission], (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.send(results)
        } else {
            return res.json([]);
        }
    })
});

module.exports = router;