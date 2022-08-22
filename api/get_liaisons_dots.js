const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");
// const config = require("../config.js");

var con = config.connection; 

router.get('/getliaisonsdots', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    let AttPoint1 = req.query.AttPoint1;
    let AttPoint2 = req.query.AttPoint2;

    const sql = 'SELECT CleDat FROM Applications WHERE DateActivation <= CURDATE() ORDER BY CleDat DESC LIMIT 1';
    con.query(sql, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            
            let cledat = String(results[0].CleDat);

            const sql = "SELECT * FROM LiaisonsDots WHERE CleDat = ? AND AttLiaison = (SELECT CleIdt FROM Liaisons WHERE CleDat = ? AND AttPointDebut = ? AND AttPointFin = ?) ORDER BY NumeroDot";
            con.query(sql, [cledat, cledat, AttPoint1, AttPoint2], (err, results) => {
                if (err) throw err
                if (results.length > 0) {
                    res.send(results)
                } else {
                    return res.json([]);
                }
            })

        } else {
            return res.json([]);
        }
    })
});

module.exports = router;