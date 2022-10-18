const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");

var con = config.connection; 

router.get('/getVehicules2', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const id = Number(req.query.id);
    const time = Number(req.query.time);
    const cleDat = time ? moment(time).format('YYMMDD') : null;

    const sql = "SELECT CleIdt, Identite, NumeroCarrosserie, (IF (NumeroCarrosserie REGEXP '[[:digit:]]+' = 'NULL', 999999, IF(NumeroCarrosserie*1 = 0, 999999, NumeroCarrosserie*1) )) as triabs " +
        `FROM Vehicules WHERE CleDat = (SELECT MAX(CleDat) FROM Applications WHERE DateDebutApplication <= ${cleDat ?? 'NOW()'}) ` +
        (id ? `AND CleIdt = ${id} ` : '') +
        'ORDER BY triabs ASC, NumeroCarrosserie ASC ';

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