const express = require("express");
const router = express.Router();
const config = require("../config_DBColl.js");
const moment = require("moment/moment.js");

var con = config.connection; 

router.get('/getVehicleCommunication', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const vehicleId = Number(req.query.vehicleId);
    const date = req.query.date;
    const pageIndex = req.query.pageIndex ?? 0;
    const pageSize = req.query.pageSize ?? 100;

    const whereClauses = [
        vehicleId ? `CleVhc = ${vehicleId}` : undefined,
        date ? `DateJr = '${moment(date).format('YYYY-MM-DD')}'` : undefined,
    ].filter(c => c);

    let filter = '';
    if (whereClauses.length > 1) {
        filter = whereClauses.reduce((a, b, index) => {
            return (`${index === 1 ? 'WHERE' : ''} ${a} AND ${b}`);
        });
    } else if (whereClauses.length === 1) {
        filter = `WHERE ${whereClauses[0]}`;
    }

    const sql = `SELECT * , \
        ( SELECT COUNT(*) as TotalCount FROM CommunicationsVehicules ${filter} ) as TotalCount \
        FROM CommunicationsVehicules \
        ${filter} \
        ORDER BY DateJr DESC \
        LIMIT ${pageIndex * pageSize}, ${pageSize}`;

    con.query(sql, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send([]);
        }
    })
});


router.get('/getPanelCommunication', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const panelId = Number(req.query.panelId);
    const date = req.query.date;
    const pageIndex = req.query.pageIndex ?? 0;
    const pageSize = req.query.pageSize ?? 100;

    const whereClauses = [
        panelId ? `ClePan = ${panelId}` : undefined,
        date ? `DateJr = '${moment(date).format('YYYY-MM-DD')}'` : undefined,
    ].filter(c => c);

    let filter = '';
    if (whereClauses.length > 1) {
        filter = whereClauses.reduce((a, b, index) => {
            return (`${index === 1 ? 'WHERE' : ''} ${a} AND ${b}`);
        });
    } else if (whereClauses.length === 1) {
        filter = `WHERE ${whereClauses[0]}`;
    }

    const sql = `SELECT * , \
        ( SELECT COUNT(*) as TotalCount FROM CommunicationsPanneaux ${filter} ) as TotalCount \
        FROM CommunicationsPanneaux \
        ${filter} \
        ORDER BY DateJr DESC \
        LIMIT ${pageIndex * pageSize}, ${pageSize}`;

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