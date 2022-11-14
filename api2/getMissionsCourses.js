const express = require("express");
const moment = require("moment/moment.js");
const router = express.Router();
const config = require("../config_DBRefr.js");

var con = config.connection; 

router.get('/getMissionsCourses', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const time = Number(req.query.time);

    const cleD = moment(time).format('YYMMDD');
    const bitDay = 1;

    const sql = 'SELECT m.CleIdt as CleMission, mc.CleIdt as CleCourse, m.NumeroMission, sv.CleIdt as CleSV, sv.NumeroService as NumSV, ' +
    'sa.CleIdt as CleSA, sa.NumeroService as NumSA, l.CodeLigneCommerciale, mc.NumeroCourse, mc.HeureDebut, mc.HeureFin, ' +
    'p1.NomPoint as NomPointDebut, p2.NomPoint as NomPointFin, ModeExploitation, sv.Nature FROM ' +
    `(SELECT MAX(CleDat) as CleDat FROM Applications WHERE CleDat <= ${cleD}) a ` +
    'INNER JOIN Missions m ON a.CleDat = m.CleDat ' +
    'INNER JOIN ServicesVoituresMissions svm ON m.CleIdt = svm.AttMission AND a.CleDat = svm.CleDat ' + 
    'INNER JOIN ServicesVoitures sv ON svm.AttService = sv.CleIdt AND a.CleDat = sv.CleDat ' +
    'LEFT JOIN ServicesAgentsMissions sam ON m.CleIdt = sam.AttMission AND a.CleDat = sam.CleDat ' +
    'LEFT JOIN ServicesAgents sa ON sam.AttService = sa.CleIdt AND a.CleDat = sa.CleDat ' +
    'INNER JOIN MissionsCourses mc ON m.CleIdt = mc.AttMission AND a.CleDat = mc.CleDat ' +
    'INNER JOIN CheminsPoints cp1 ON cp1.CleDat = a.CleDat AND cp1.AttChemin = mc.AttChemin ' +
    'AND cp1.AttPoint = (SELECT AttPoint FROM CheminsPoints WHERE CleDat = a.CleDat AND AttChemin = mc.AttChemin ORDER BY NumeroPoint ASC LIMIT 1) ' +
    'LEFT JOIN PointsPassage p1 ON p1.CleDat = a.CleDat AND cp1.AttPoint = p1.CleIdt ' +
    'INNER JOIN CheminsPoints cp2 ON cp2.CleDat = a.CleDat AND cp2.AttChemin = mc.AttChemin ' +
    'AND cp2.AttPoint = (SELECT AttPoint FROM CheminsPoints WHERE CleDat = a.CleDat AND AttChemin = mc.AttChemin ORDER BY NumeroPoint DESC LIMIT 1) ' +
    'LEFT JOIN PointsPassage p2 ON p2.CleDat = a.CleDat AND cp2.AttPoint = p2.CleIdt ' +
    'LEFT JOIN Lignes l ON l.CleDat = a.CleDat AND l.CleIdt = mc.AttLigne ' +
    `WHERE sv.JoursHabilitation & ${bitDay} = ${bitDay} ` +
    `AND (${bitDay} = ${bitDay} ` +
    'OR sa.JoursHabilitation IS NULL) ' +
    'ORDER BY m.NumeroMission ASC ';
    
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