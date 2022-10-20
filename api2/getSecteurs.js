const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");

var con = config.connection;

router.get('/getSecteurs/:id', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const time = Number(req.query.time);
    const cleDat = time ? moment(time).format('YYMMDD') : null;
    const id = Number(req.params.id);

    const sql = 'SELECT DISTINCT (sec.Identite*1) AS tri, sec.Identite \
        FROM PointsPassage AS pp \
        INNER JOIN Secteurs AS sec ON sec.CleIdt = pp.AttSecteur AND sec.CleDat = pp.CleDat \
        INNER JOIN Panneaux AS pan ON pan.CleIdt = pp.AttPanneau AND pan.CleDat = pp.CleDat AND pp.AttPanneau = ' + id + ' \
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