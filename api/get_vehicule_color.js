const express = require("express");
const router = express.Router();
const config = require("../config_DBRefr.js");
// const config = require("../config.js");

var con = config.connection; 

router.get('/getvehiculecolor', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    let id_line = req.query.id_line;
    const sql = 'SELECT * FROM Lignes INNER JOIN Applications ON Lignes.CleDat = Applications.CleDat WHERE Lignes.CLeIdt = ? AND Applications.DateActivation <= CURDATE( ) ORDER BY Applications.CleDat DESC LIMIT 1';
    con.query(sql, id_line, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            res.send(results)
        } else {
            return res.json([]);
        }
    })
});

module.exports = router;


// router.get('/getvehiculecolor/:id_line', (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
//     res.setHeader('Access-Control-Allow-Credentials', true); // If needed

//     // console.log(req.body);
//     // let id_line = req.body.id_line;

//     const sql = 'SELECT * FROM Lignes WHERE CleIdt = ? ORDER BY CleDat DESC LIMIT 1';
//     con.query(sql, req.params.id_line , (err, results) => {
//         if (err) throw err
//         if (results.length > 0) {
//             res.send(results)
//         } else {
//             return res.json([]);
//         }
//     })

    
//     // console.log("test:", req.body.id_line);
//     // // res.send(req.);
//     // return res.json(req.body);
// });

// module.exports = router;