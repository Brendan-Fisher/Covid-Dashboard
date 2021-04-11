require("dotenv").config();
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const connectString = process.env.DB_CONNECTSTRING;

router.route("/").post(async function(req, res) {
    let connection, result;
    //console.log(req.body)
    try {
        connection = await oracledb.getConnection({
            user: username,
            password: password,
            connectString: connectString,
        })

        switch(req.body.query){
            case "TupleCount":
                result = await connection.execute(
                    "WITH t1 AS (SELECT COUNT(*) c1 FROM Cdc), t2 AS (SELECT COUNT(*) c2 FROM State), t3 AS (SELECT COUNT(*) c3 FROM Cases), t4 AS (SELECT COUNT(*) c4 FROM Tests), t5 AS (SELECT COUNT(*) c5 FROM Outcomes) SELECT c1,c2,c3,c4,c5 FROM t1,t2,t3,t4,t5"
                );
                break;
            case 'CasesBySex':
                result = await connection.execute(
                    "SELECT SEX AS Sex, COUNT(SEX) AS Quantity FROM CDC WHERE SEX = 'Male' OR SEX = 'Female' OR SEX = 'Unknown' GROUP BY SEX"
                );
                break;

        }

        res.json(result);
    } catch (err) {
        console.error(err);
    }
})

module.exports = router;