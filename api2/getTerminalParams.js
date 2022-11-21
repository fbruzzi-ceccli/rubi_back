const express = require("express");
const router = express.Router();
const config = require("../config_DBRT.js");

var con = config.connection; 

router.get('/getTerminalParams', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const isAdmin = req.query.isAdmin === 'true' ? 1 : 0;
    const pageIndex = req.query.pageIndex ?? 0;
    const pageSize = req.query.pageSize ?? 100;
    const terminalId = req.query.terminalId;

    const query = `FROM ParametresPanneau
        ${terminalId ? `JOIN ConfigPanneau ON ConfigPanneau.NomParametre = ParametresPanneau.NomParametre WHERE ConfigPanneau.AttPanneau = ${terminalId}` : ''}
        ${terminalId ? 'AND' : 'WHERE'}
        Admin = ${isAdmin}
    `;

    const sql = `SELECT * ,
        ( SELECT COUNT(*) ${query} ) as TotalCount
        ${query}
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


router.put('/updateTerminalParams', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const params = req.body.params ?? [];
    const terminalId = req.body.terminalId;
    const updateArr = Object.keys(params).map(k => `SELECT '${k}' as param, ${terminalId} as id, '${params[k]}' as value`);

    const sql = `UPDATE ConfigPanneau JOIN
        ( ${updateArr.reduce((a, b) => `${a} UNION ALL ${b}`)} )
        vals ON ConfigPanneau.AttPanneau = vals.id
        AND ConfigPanneau.NomParametre = vals.param COLLATE utf8_general_ci
        SET Valeur = value`;

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