const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");

var con = config.connection;

router.get('/getPanneaux', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const time = Number(req.query.time);
    const cleDat = time ? moment(time).format('YYMMDD') : null;

    const sql = 'SELECT CleDat, CleIdt, NumeroPanneau, Identite \
        FROM Panneaux \
        WHERE CleDat = (SELECT MAX(CleDat) FROM Applications WHERE DateDebutApplication <= NOW()) \
        ORDER BY NumeroPanneau ASC \
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