const express = require("express");
const moment = require("moment/moment.js");
const router = express.Router();
const config = require("../config_DBColl.js");

var con = config.connection; 

router.get('/getStopPassHistory', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed


    const date = req.query.date ?? new Date();
    const vehicleBodyId = req.query.vehicleBodyId ?? undefined;
    console.log(
        date,
        vehicleBodyId,
        moment(date).format('YYYY-MM-DD'),
        moment(date).format('YYMMDD')
    );
    const cleDat = moment(date).format('YYMMDD');

    const sql = `SELECT PassArts.DateJr, Vehicules.NrParc, Lignes.NroCom, \
        Points.NomSAE, PassArts.HrePss , PassArts.HreThDep, PassArts.CleLig \
        FROM PassArts \
        INNER JOIN Vehicules, Points, Lignes \
        WHERE PassArts.CleVhc = Vehicules.CleIdt \
        AND Points.CleDat = (SELECT MAX(CleDat) FROM Lignes WHERE CleDat <= '${cleDat}') \
        AND PassArts.CleArt = Points.CleIdt
        AND Lignes.CleDat = (SELECT MAX(CleDat) FROM Lignes WHERE CleDat <= '${cleDat}') \
        AND PassArts.CleLig = Lignes.CleIdt \
        AND PassArts.DateJr = '${moment(date).format('YYYY-MM-DD')}' \
        ${vehicleBodyId ? `AND Vehicules.NrParc = ${vehicleBodyId}` : ''} \
        ORDER BY Vehicules.NrParc * 1, PassArts.HrePss ASC`;
        
    con.query(sql, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send([]);
        }
    })
});

router.get('/getAffectJr', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const date = req.query.date ?? new Date();

    const sql = `SELECT NroSeq, DateJr, NrParc, Agents.Mtrcle, \
        Agents.Prenom, Agents.NomFam, NroSrvA, NroSrvV, HreDeb, HreFin, Dblage, AffectJr.NroCom \
        FROM AffectJr \
        LEFT OUTER JOIN Agents ON Agents.CleIdt = AffectJr.CleAgt \
        WHERE DateJr = '${moment(date).format('YYYY-MM-DD')}' \
        AND AffectJr.NroCom != ''
        ORDER BY NroSeq ASC`;

    console.log(sql);

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