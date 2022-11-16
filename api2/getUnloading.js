const express = require("express");
const router = express.Router();
const config = require("../config_DBRT.js");
const moment = require("moment/moment.js");

var con = config.connection; 

router.get('/getUnloading', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const fileType = req.query.fileType;
    const vehicleId = Number(req.query.vehicleId);
    const date = req.query.date;
    const pageIndex = req.query.pageIndex ?? 0;
    const pageSize = req.query.pageSize ?? 100;

    const whereClauses = [
        fileType ? `TypeFichier = '${fileType}'` : undefined,
        vehicleId ? `CleIdt = ${vehicleId}` : undefined,
        date ? `DATE(DateDechargement) = '${moment(date).format('YYYY-MM-DD')}'` : undefined,
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
        ( SELECT COUNT(*) as TotalCount FROM Dechargements ${filter} ) as TotalCount \
        FROM Dechargements \
        ${filter} \
        ORDER BY DateDechargement ASC \
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