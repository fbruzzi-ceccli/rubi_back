const express = require("express");
const moment = require("moment/moment.js");
const router = express.Router();
const config = require("../config_DBRefr.js");

var con = config.connection;

router.get('/getLinePaths', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const lineId = req.query.lineId ? Number(req.query.lineId) : undefined;

    const sql = `SELECT CleIdt FROM Chemins \
        WHERE CleDat = (SELECT MAX(CleDat) FROM Applications WHERE CleDat <= NOW()) \
        AND AttLigneCom = ${lineId}`
    
    con.query(sql, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send([]);
        }
    })
});

router.get('/getPathPoints', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const pathId = req.query.pathId ? Number(req.query.pathId) : undefined;

    // const sql = `SELECT Path.AttributsPoint, Point.NomPoint \
    //     FROM CheminsPoints AS Path \
    //     INNER JOIN PointsPassage AS Point ON Path.AttPoint = Point.CleIdt \
    //     WHERE AttChemin = "${pathId}" AND (Path.AttributsPoint & 3 > 0) \
    //     AND Point.CleDat = Path.CleDat`;

    const sql = `SELECT cp.AttributsPoint, pp.NomPoint, pp.CleIdt \
        FROM CheminsPoints as cp \
        INNER JOIN PointsPassage as pp ON cp.AttPoint = pp.CleIdt AND pp.CleDat = cp.CleDat \
        WHERE AttChemin = ${pathId} \
        AND pp.CleDat = (SELECT MAX(CleDat) FROM Applications) \
        ORDER BY NumeroPoint ASC`
        
        // WHERE AttChemin = ${pathId} AND (cp.AttributsPoint & 3 > 0) \
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