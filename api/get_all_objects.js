const express = require("express");
const router = express.Router();
const config = require("../config.js");

var con = config.connection; 

router.get('/getallobjects', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    const sql = 'SELECT * FROM objects'
    con.query(sql, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            let arr = [];
            for(let i = 0 ; i < results.length ; i++)
            {
                let obj = {
                    o_id: results[i].o_id,
                    o_leaflet_id: results[i].o_leaflet_id,
                    o_type: results[i].o_type,
                    o_options: JSON.parse(results[i].o_options),
                    o_coords: JSON.parse(results[i].o_coords)
                };
                arr.push(obj);
            }
            res.json(arr)
        } else {
            res.send([]);
        }
    })
});

module.exports = router;