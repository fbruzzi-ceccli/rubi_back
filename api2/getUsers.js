const express = require("express");
const router = express.Router();
const config = require("../config_DBRT.js");

var con = config.connection;

router.get('/getUsersCount', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const sql = "SELECT COUNT(*) as TotalCount FROM UtilisateursSaphir WHERE Utilisateur != 'CECCLI'";
    
    con.query(sql, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send([]);
        }
    })
});
router.get('/getUsers', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const pageIndex = req.query.pageIndex ?? 0;
    const pageSize = req.query.pageSize ?? 100;

    const sql = "SELECT Id, Utilisateur, Nom, Prenom FROM UtilisateursSaphir WHERE Utilisateur != 'CECCLI' ORDER BY Nom " +
        `LIMIT ${pageIndex * pageSize}, ${pageSize}`;
    
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