const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");

var con = config.connection; 

router.get('/getMissions', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const id = Number(req.query.id);

    const sql = 'SELECT CleIdt, NumeroMission ' +
        'FROM Missions ' + 
        'WHERE CleDat = (SELECT MAX(CleDat) FROM Applications WHERE DateDebutApplication <= NOW()) ' +
        (id ? `AND CleIdt = ${id} ` : '');

        // console.log(sql)
    
    con.query(sql, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.json(results)
        } else {
            res.send([]);
        }
    })
});


router.get('/getServicesFromMission', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const missionId = Number(req.query.missionId);

    const sql = `SELECT ServicesVoitures.NumeroService as SV, ServicesAgents.NumeroService as SA \
        FROM ServicesVoituresMissions \
        INNER JOIN ServicesAgentsMissions ON ServicesAgentsMissions.AttMission = ServicesVoituresMissions.AttMission \
        INNER JOIN ServicesVoitures ON ServicesVoituresMissions.AttService = ServicesVoitures.CleIdt \
        INNER JOIN ServicesAgents ON ServicesAgentsMissions.AttService = ServicesAgents.CleIdt \
        WHERE ServicesVoituresMissions.CleDat = (SELECT MAX(CleDat) FROM Applications WHERE DateDebutApplication <= NOW()) \
        AND ServicesVoituresMissions.CleDat = ServicesVoitures.CleDat \
        ${missionId ? ` \
            AND ServicesVoituresMissions.AttMission = ${missionId} \
            AND ServicesAgentsMissions.AttMission = ${missionId} \
        ` : ''} \
        AND ServicesAgentsMissions.CleDat = (SELECT MAX(CleDat) FROM Applications WHERE DateDebutApplication <= NOW()) \
        AND ServicesAgentsMissions.CleDat = ServicesAgents.CleDat \
    `;
    
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