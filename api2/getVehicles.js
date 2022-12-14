const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");

var con = config.connection; 

router.get('/getVehicles', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    let cledat = req.query.dateKey;
    const sql = 'SELECT V.CleIdt, V.NumeroCarrosserie, ' +
        'V.AttTypeCalculateurTR, V.AttTypeCalculateurTFT, ' +
        'V.AttTypeCalculateurPupitre, D.Identite ' +
        'FROM Vehicules V, Depots D WHERE ' +
        `V.CleDat = ${cledat} AND ` +
        `D.CleDat = ${cledat} AND ` +
        'V.AttDepot = D.CleIdt ' +
        'ORDER BY V.NumeroCarrosserie';
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