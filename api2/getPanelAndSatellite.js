const express = require('express');
const router = express.Router();
const config = require('../config_DBRefr.js');

var con = config.connection; 

router.get('/getPanelAndSatellite', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    let cledat = req.query.dateKey;
    const sql = "SELECT 'PAN' as Type, P.CleIdt  as CleIdt, P.NumeroPanneau as Numero, " +
        'P.AttTypeCalculateur, ' +
        'P.Identite, ' +
        'P.AttTypePanneau ' +
        'FROM Panneaux P, TypesPanneaux TP  WHERE ' +
        `P.CleDat = ${cledat} AND ` +
        `TP.CleDat = ${cledat} AND ` +
        'P.AttTypePanneau = TP.CleIdt ' +
        'UNION ' +
        "SELECT 'SAT' as Type, S.CleIdt  as CleIdt, S.NumeroSatellite as Numero, " +
        'S.AttTypeCalculateur, ' +
        'S.Identite, ' +
        'S.AttTypeSatellite ' +
        'FROM Satellites S, TypesSatellites TS  WHERE ' +
        `S.CleDat = ${cledat} AND ` +
        `TS.CleDat = ${cledat} AND ` +
        'S.AttTypeSatellite = TS.CleIdt ' +
        'ORDER BY Numero'
  ;
    con.query(sql, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send([]);
        }
    })
});

// TO DO: Rename previous route
router.get('/getPanelAndSatellite2', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed


    const pageIndex = req.query.pageIndex;
    const pageSize = req.query.pageSize ?? 100;
    const paginated = typeof pageIndex !== 'undefined';
    const terminalId = req.query.terminalId;

    const queryTerminalId = terminalId ? `AND CleIdt = ${terminalId}` : '';

    const query1 = `FROM Panneaux WHERE CleDat = (SELECT MAX(CleDat) FROM Applications WHERE DateDebutApplication <= NOW()) ${queryTerminalId}`;
    const query2 = `FROM Satellites WHERE CleDat = (SELECT MAX(CleDat) FROM Applications WHERE DateDebutApplication <= NOW()) ${queryTerminalId}`;

    const sql = `SELECT Identite, CleIdt, NumeroPanneau as Number, 'PAN' as Type
        ${paginated ? `,( SELECT COUNT(*) ${query1} ) as TotalCount` : '' }
        ${query1}
        UNION
        SELECT Identite, CleIdt, NumeroSatellite as Number, 'SAT' as Type
        ${paginated ? `,( SELECT COUNT(*) ${query2} ) as TotalCount` : '' }
        ${query2}
        ORDER BY Type, Number
        ${paginated ? `LIMIT ${pageIndex * pageSize}, ${pageSize}` : ''}`;

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