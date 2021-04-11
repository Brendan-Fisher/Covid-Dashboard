require("dotenv").config();
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
var fs = require('fs');
var es = require('event-stream');


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

        let query = "";

        switch(req.body.query){
            case "TupleCount":
                result = await connection.execute(
                    "WITH t1 AS (SELECT COUNT(*) c1 FROM Cdc), t2 AS (SELECT COUNT(*) c2 FROM State), t3 AS (SELECT COUNT(*) c3 FROM Cases), t4 AS (SELECT COUNT(*) c4 FROM Tests), t5 AS (SELECT COUNT(*) c5 FROM Outcomes) SELECT c1,c2,c3,c4,c5 FROM t1,t2,t3,t4,t5"
                );
                break;
            case 'CasesBySex':
                query = "SELECT SEX AS Sex, COUNT(SEX) AS Quantity FROM CDC GROUP BY SEX ORDER BY COUNT(SEX) DESC";
                result = await connection.execute(
                    "SELECT SEX AS Sex, COUNT(SEX) AS Quantity FROM CDC GROUP BY SEX ORDER BY COUNT(SEX) DESC"
                );
                break;
        }

        let response = {
            query: query,
            result: result,
        }

        writeQueryResult(result);

        res.json(response);
    } catch (err) {
        console.error(err);
    }
})

router.route("/download").get((req, res) => {
    let CSV = [];

    let readStream = fs.createReadStream('./result/query_result.csv')
                        .pipe(es.split())
                        .pipe(
                            es
                                .mapSync(function(line) {
                                    CSV.push(line.split(','))
                                })
                        )
                        .on('end', function(){
                            let cleanCSV = CSV.slice(0,CSV.length-1);
                            //console.log(CSV);
                            res.json(cleanCSV);
                        })
})

function writeQueryResult(data){
    //console.log(data);
    let writeStream = fs.createWriteStream('./result/query_result.csv');

    let headers = [];
    data.metaData.forEach((header) => {
        headers.push(header.name);
    })

    writeStream.write(headers.join(',') + '\n');

    data.rows.forEach((row) => {
        writeStream.write(row.join(',') + '\n');
    })
}

module.exports = router;