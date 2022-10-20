const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");

var con = config.connection;

router.get('/getLinesServed/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const time = Number(req.query.time);
    const cleDat = time ? moment(time).format('YYMMDD') : null;
    const id = Number(req.params.id);

    const sql = 'SELECT DISTINCT (lig.CodeLigneCommerciale*1) AS tri, lig.CleIdt \
        FROM PointsPassage AS pp \
        INNER JOIN PredPass AS pred ON pred.AttPnt = pp.CleIdt \
        INNER JOIN SatellitesPanneaux AS sp ON sp.AttPanneau = pp.AttPanneau AND sp.CleDat = pp.CleDat AND sp.AttSatellite = ' + id + ' \
        INNER JOIN Lignes AS lig ON lig.CleIdt = pred.AttLig AND lig.CleDat = pp.CleDat \
        AND pp.CleDat = ( \
        SELECT MAX( CleDat ) \
        FROM Applications \
        WHERE DateDebutApplication <= NOW( ) ) \
        ORDER BY tri ASC \
    ';

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