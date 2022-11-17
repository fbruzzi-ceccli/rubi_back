const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");

var con = config.connection;

router.get('/getVehiclesTypes', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const id = Number(req.query.id);

    const sql = `SELECT Vehicules.CleIdt, Vehicules.NumeroCarrosserie \
            FROM Vehicules \
            INNER JOIN TypesVehicules ON Vehicules.CleDat=TypesVehicules.CleDat \
            AND Vehicules.AttTypeVehicule=TypesVehicules.CleIdt \
            WHERE TypesVehicules.CleDat = ${id} AND TypesVehicules.CodeDessin > 1 \
            ORDER BY Vehicules.NumeroCarrosserie`
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