const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");
// const config = require("../config.js");

var con = config.connection; 

router.get('/getalllines', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed


    const sql = 'SELECT distinct CleIdt, CodeLigneCommerciale, LibelleLigneCommerciale, CouleurFondR, CouleurFondV, CouleurFondB, CouleurAvntR, CouleurAvntV, CouleurAvntB FROM Lignes WHERE CleDat = (select max(CleDat) from Lignes) ORDER BY CAST(CodeLigneCommerciale as UNSIGNED INTEGER)';
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