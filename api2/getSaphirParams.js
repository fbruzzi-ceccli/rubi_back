const express = require("express");
const router = express.Router();
const config = require("../config_DBRT.js");

var con = config.connection; 

router.get('/getSaphirParams', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const isAdmin = req.query.isAdmin ? Number(req.query.isAdmin) : 0;
    const pageIndex = req.query.pageIndex ?? 0;
    const pageSize = req.query.pageSize ?? 100;

    const query =  `FROM ParametresSaphir WHERE Admin = ${isAdmin}`

    const sql = `SELECT * , \
        ( SELECT COUNT(*) ${query} ) as TotalCount \
        ${query} \
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

router.put('/updateSaphirParams', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const param = req.body.param;
    const value = req.body.value;
    const comment = req.body.comment;

    const updateArr = [
        typeof value !== 'undefined' ? `ValeurParam = '${value}'` : undefined,
        typeof comment !== 'undefined' ? `Commentaire = '${comment}'` : undefined,
    ].filter(u => u);

    const sql = `UPDATE ParametresSaphir \
        SET ${updateArr.reduce((a, b) => `${a}, ${b}`)} \
        WHERE CleParam = '${param}'`;

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