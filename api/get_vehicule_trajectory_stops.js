const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");
// const config = require("../config.js");

var con = config.connection; 

router.get('/getvehiculetrajectorystops', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    let att_chemin = req.query.att_chemin;

    const sql = 'SELECT CleDat FROM Applications WHERE DateActivation <= CURDATE() ORDER BY CleDat DESC LIMIT 1';
    con.query(sql, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            
            let cledat = String(results[0].CleDat);

            const sql = "SELECT CheminsPoints.NumeroPoint, CheminsPoints.AttPoint, CheminsPoints.AttributsPoint, PointsPassage.NomPoint, PointsPassage.CoordonneeX, PointsPassage.CoordonneeY, PointsPassage.CoordonneeZ FROM  CheminsPoints , PointsPassage WHERE CheminsPoints.CleDat = ? and CheminsPoints.AttChemin = ? and CheminsPoints.AttPoint = PointsPassage.CleIdt and CheminsPoints.CleDat = PointsPassage.CleDat order by CheminsPoints.NumeroPoint"
            con.query(sql, [cledat, att_chemin], (err, results) => {
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