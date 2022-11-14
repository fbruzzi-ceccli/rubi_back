const express = require("express");
const router = express.Router();
const config = require("../config_DBColl.js");

var con = config.connection; 

router.get('/getConnectionHistoryCount', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const vehicleId = req.query.vehicleId ?? null;

    const sql = 'SELECT COUNT(*) AS NbTotal FROM HistoriqueConnexions ' +
        (vehicleId ? `WHERE CleVhc='${vehicleId}' ` : '');

    con.query(sql, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send([]);
        }
    })
});

router.get('/getConnectionHistory', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    const pageIndex = req.query.pageIndex ?? 0;
    const pageSize = req.query.pageSize ?? 100;
    const vehicleId = req.query.vehicleId ?? null;


    console.log('TEST FB', vehicleId, !!vehicleId, !!vehicleId ? `WHERE CleVhc='${vehicleId}' ` : '')

    const sql = 'SELECT Heure, CleVhc, Entite FROM HistoriqueConnexions ' +
        (vehicleId ? `WHERE CleVhc='${vehicleId}' ` : '') +
        `ORDER BY Heure DESC ` +
        `LIMIT ${pageIndex * pageSize}, ${pageSize}`;

        console.log('test fb', sql);

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