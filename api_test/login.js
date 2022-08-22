const express = require("express");
const router = express.Router();
const config = require("../config.js");

const CryptoJS  = require("crypto-js");
var con = config.connection; 

router.post('/login', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    

    let username = req.body.username;
    let password = req.body.password;

    const sql = 'SELECT a_id, a_fullname, a_username, a_created_at, p_name \
                FROM account, account_profile, profile WHERE account.a_username = ? AND account.a_password = ? \
                AND account.a_id = account_profile.ap_aid AND account_profile.ap_pid = profile.p_id';

    con.query(sql, [username, password], (err, results) => {
        if (err) throw err
        if (results.length > 0) {            
            let arr = results;
            a_id = arr[0].a_id;

            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let token = "";
            for (let i = 32; i > 0; --i) token += possible[Math.floor(Math.random() * possible.length)];
            token += Date.now();
            let session_encrypted = CryptoJS.AES.encrypt(token, '123456').toString();

            let sql1 = 'INSERT INTO account_session (as_aid, as_session_token) VALUES (?, ?)';
            con.query(sql1, [a_id, session_encrypted], (err, results) => {
                if (err)
                { 
                    return res.json([]);
                }
                else
                {
                    arr.unshift({"session_token": session_encrypted});
                    return res.json(arr);
                }
            })

        } else {
            return res.json([]);
        }
    })

});

module.exports = router;

