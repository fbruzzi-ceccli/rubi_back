const express = require("express");
const router = express.Router();
const config = require("../config_DBRT.js");

var con = config.connection;

router.get('/getScenario', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    // const id = Number(req.query.id);
    // const typeSupport = req.query.typeSupport;
    const vehicleId = Number(req.query.vehicleId);
    const date = req.query.date;
    const pageIndex = req.query.pageIndex ?? 0;
    const pageSize = req.query.pageSize ?? 100;

    const whereClauses = [
        vehicleId ? `AttSupport = ${vehicleId}` : undefined,
        date ? `DATE(DateHeure) = '${moment(date).format('YYYY-MM-DD')}'` : undefined,
    ].filter(c => c);

    let filter = '';
    if (whereClauses.length > 1) {
        filter = whereClauses.reduce((a, b, index) => {
            return (`${index === 1 ? 'WHERE' : ''} ${a} AND ${b}`);
        });
    } else if (whereClauses.length === 1) {
        filter = `WHERE ${whereClauses[0]}`;
    }

    const request = `FROM Scenario
    INNER JOIN DeploiementScenario ON DeploiementScenario.AttScenario = Scenario.CleIdt
    INNER JOIN ScenarioDeploye ON ScenarioDeploye.AttDeploiementScenario = DeploiementScenario.CleIdt`;

    const sql = `SELECT Scenario.NomFichier, Scenario.Version, DeploiementScenario.DateApplication, ScenarioDeploye.DateChargementFin, DeploiementScenario.AttSupport,
        ( SELECT COUNT(*) as TotalCount ${request} ${filter} ) as TotalCount
        ${request} ${filter}
        ORDER BY ScenarioDeploye.DateChargementFin DESC
        LIMIT ${pageSize} OFFSET ${pageIndex * pageSize}`;
        // WHERE DeploiementScenario.AttSupport = ${id} AND TypeSupport = '${typeSupport}' ${typeSupport === 'VEH' ? 'AND ScenarioDeploye.DateChargementFin IS NOT NULL' : ''}
    console.log('con.query ~ sql', sql);
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