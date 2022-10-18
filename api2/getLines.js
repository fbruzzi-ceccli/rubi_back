const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");

var con = config.connection; 

router.get('/getLines', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const id = Number(req.query.id);

    const sql = "SELECT CleIdt, CodeLigneCommerciale, LibelleLigneCommerciale, (IF (CodeLigneCommerciale REGEXP '[[:digit:]]+' = 'NULL', 999999, IF(CodeLigneCommerciale*1 = 0, 999999, CodeLigneCommerciale*1) )) as triabs, " +
        'CouleurFondR, CouleurFondV, CouleurFondB, ' +
        'CouleurAvntR, CouleurAvntV, CouleurAvntB, ' +
        'PetiteAvance, PetitRetard, GrandeAvance, GrandRetard ' +
        'FROM Lignes ' +
        'WHERE CleDat = (SELECT MAX(CleDat) FROM Applications WHERE DateDebutApplication <= NOW()) ' +
        (id ? `AND CleIdt = ${id} ` : '') +
        'ORDER BY triabs ASC, CodeLigneCommerciale ASC';
    
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