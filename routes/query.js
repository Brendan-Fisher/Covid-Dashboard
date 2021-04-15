require("dotenv").config();
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
var fs = require('fs');
var es = require('event-stream');
var isEmpty = require('is-empty');

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const connectString = process.env.DB_CONNECTSTRING;

router.route("/").post(async function(req, res) {
    let connection, result;
    console.log(req.body)
    try {
        connection = await oracledb.getConnection({
            user: username,
            password: password,
            connectString: connectString,
        })

        let query = "";
        let labels = 0;
        let s1 = req.body.query.stateOne;
        let s2 = req.body.query.stateTwo;
        let d1 = isEmpty(req.body.query.startDate) ? '2020-01-01' : req.body.query.startDate;
        let d2 = isEmpty(req.body.query.endDate) ? '2021-02-13' : req.body.query.endDate;
        let sets = 0;

        switch(req.body.query.query){
            case "TupleCount":
                result = await connection.execute(
                    "WITH t1 AS (SELECT COUNT(*) c1 FROM Cdc), t2 AS (SELECT COUNT(*) c2 FROM State), t3 AS (SELECT COUNT(*) c3 FROM Cases), t4 AS (SELECT COUNT(*) c4 FROM Tests), t5 AS (SELECT COUNT(*) c5 FROM Outcomes) SELECT c1,c2,c3,c4,c5 FROM t1,t2,t3,t4,t5"
                );
                break;
            case 'CasesBySex':
                query = "SELECT SEX AS Sex, COUNT(SEX) AS Quantity FROM CDC GROUP BY SEX ORDER BY COUNT(SEX) DESC";
                result = await connection.execute(
                    query,

                );
                break;
            case 'CasesBySexOverTime':
                query =`WITH R(Month, Sex, Count) AS (SELECT TO_CHAR(refDate, 'MM-YYYY') AS Month, Sex, COUNT(Sex) AS Count FROM CDC WHERE TO_CHAR(REFDATE, 'YYYY-MM-DD') >= ${d1} AND TO_CHAR(REFDATE, 'YYYY-MM-DD') <= ${d2} GROUP BY TO_CHAR(refDate, 'MM-YYYY'), Sex) SELECT * FROM R`
                sets = 6;
                result = await connection.execute(
                    "WITH R(Month, Sex, Count) AS (SELECT TO_CHAR(refDate, 'MM-YYYY') AS Month, Sex, COUNT(Sex) AS Count FROM CDC WHERE TO_CHAR(REFDATE, 'YYYY-MM-DD') >= :d1 AND TO_CHAR(REFDATE, 'YYYY-MM-DD') <= :d2 GROUP BY TO_CHAR(refDate, 'MM-YYYY'), Sex) SELECT * FROM R ORDER BY Month",
                    {
                        d1: d1,
                        d2: d2
                    }
                );
                break;
            case 'CasesBySexOnDay':
                query = `SELECT Sex, COUNT(Sex) AS Quantity FROM CDC WHERE TO_CHAR(REFDATE, 'YYYY-MM-DD') = ${d2} GROUP BY Sex ORDER BY COUNT(Sex) DESC`;
                result = await connection.execute(
                    "SELECT Sex, COUNT(Sex) AS Quantity FROM CDC WHERE TO_CHAR(REFDATE, 'YYYY-MM-DD') = :d2 GROUP BY Sex ORDER BY COUNT(Sex) DESC",
                    {
                        d2: d2,
                    }
                )
                break;
            case 'CasesByEthnicity':
                query = "SELECT Ethnicity, COUNT(Ethnicity) AS Quantity FROM CDC GROUP BY Ethnicity ORDER BY COUNT(Ethnicity) DESC";
                result = await connection.execute(
                    query,
                )
                break;
            case 'CasesByEthnicityOnDay':
                query = `SELECT Ethnicity, COUNT(Ethnicity) AS Quantity FROM CDC WHERE TO_CHAR(REFDATE, 'YYYY-MM-DD') = ${d2} GROUP BY Ethnicity ORDER BY COUNT(Ethnicity) DESC`;
                result = await connection.execute(
                    "SELECT Ethnicity, COUNT(Ethnicity) AS Quantity FROM CDC WHERE TO_CHAR(REFDATE, 'YYYY-MM-DD') = :d2 GROUP BY Ethnicity ORDER BY COUNT(Ethnicity) DESC",
                    {
                        d2: d2,
                    }
                )
                break;
            case 'CasesByEthnicityOverTime':
                query = `WITH R(Month, Ethnicity, Count) AS (SELECT TO_CHAR(refDate, 'MM-YYYY') AS Month, Ethnicity, COUNT(Sex) AS Count FROM CDC WHERE TO_CHAR(REFDATE, 'YYYY-MM-DD') >= ${d1} AND TO_CHAR(REFDATE, 'YYYY-MM-DD') <= ${d2} GROUP BY TO_CHAR(refDate, 'MM-YYYY'), Ethnicity) SELECT * FROM R`
                sets = 10;
                result = await connection.execute(
                    "WITH R(Month, Ethnicity, Count) AS (SELECT TO_CHAR(refDate, 'MM-YYYY') AS Month, Ethnicity, COUNT(Ethnicity) AS Count FROM CDC WHERE TO_CHAR(REFDATE, 'YYYY-MM-DD') >= :d1 AND TO_CHAR(REFDATE, 'YYYY-MM-DD') <= :d2 GROUP BY TO_CHAR(refDate, 'MM-YYYY'), Ethnicity) SELECT * FROM R ORDER BY Month",
                    {
                        d1: d1,
                        d2: d2
                    }
                )
                break;
            case 'CasesByAge':
                query = "SELECT Age, COUNT(Age) AS Quantity FROM CDC GROUP BY Age ORDER BY COUNT(Age) DESC";
                result = await connection.execute(
                    query,
                )
                break;
            case 'CasesByAgeOnDay':
                query = `SELECT Age, COUNT(Age) AS Quantity FROM CDC WHERE refDate = ${d2} GROUP BY Age ORDER BY COUNT(Age) DESC`;
                result = await connection.execute(
                    "SELECT Age, COUNT(Age) AS Quantity FROM CDC WHERE TO_CHAR(REFDATE, 'YYYY-MM-DD') = :d2 GROUP BY Age ORDER BY COUNT(Age) DESC",
                    {
                        d2: d2,
                    }
                )
                break;
            case 'CasesByAgeOverTime':
                query = `WITH R(Month, Age, Count) AS (SELECT TO_CHAR(refDate, 'MM-YYYY') AS Month, Age, COUNT(Age) AS Count FROM CDC WHERE TO_CHAR(REFDATE, 'YYYY-MM-DD') >= ${d1} AND TO_CHAR(REFDATE, 'YYYY-MM-DD') <= ${d2} GROUP BY TO_CHAR(refDate, 'MM-YYYY'), Age) SELECT * FROM R`
                sets = 11;
                result = await connection.execute(
                    "WITH R(Month, Age, Count) AS (SELECT TO_CHAR(refDate, 'MM-YYYY') AS Month, Age, COUNT(Age) AS Count FROM CDC WHERE TO_CHAR(REFDATE, 'YYYY-MM-DD') >= :d1 AND TO_CHAR(REFDATE, 'YYYY-MM-DD') <= :d2 GROUP BY TO_CHAR(refDate, 'MM-YYYY'), Age) SELECT * FROM R ORDER BY Month",
                    {
                        d1: d1,
                        d2: d2
                    }
                )
                break;
            case 'GdpPerCase':
                query = `SELECT Name, GdpPerCase FROM (SELECT gdp/nullif(posTotal,0) as GdpPerCase, Name FROM (SELECT sum(posTotal) as posTotal, Name, gdp FROM Tests, State WHERE Tests.state=state.code AND (Name = ${s1} OR Name = ${s2}) GROUP BY Name, gdp))`
                result = await connection.execute(
                    "SELECT Name, GdpPerCase FROM (SELECT gdp/nullif(posTotal,0) as GdpPerCase, Name FROM (SELECT sum(posTotal) as posTotal, Name, gdp FROM Tests, State WHERE Tests.state=state.code AND (Name = :s1 OR Name = :s2) GROUP BY Name, gdp))",
                    {
                        s1: s1,
                        s2: s2,
                    }
                )
                break;
            case 'GdpPerCaseOverTime':
                query = `SELECT Month, Name, GdpPerCase  FROM (SELECT Month, gdp/nullif(posTotal,0) as GdpPerCase, Name FROM (SELECT TO_CHAR(refDate, 'MM-YYYY') AS Month, sum(posTotal) as posTotal, Name, gdp FROM Tests, State WHERE Tests.state=state.code AND (Name = ${s1} OR Name = ${s2}) AND (TO_CHAR(REFDATE, 'YYYY-MM-DD') >= ${d1} AND TO_CHAR(REFDATE, 'YYYY-MM-DD') <= ${d2}) GROUP BY TO_CHAR(refDate, 'MM-YYYY'), Name, gdp))`
                sets = 2;
                result = await connection.execute(
                    "SELECT Month, Name, GdpPerCase FROM (SELECT Month, gdp/nullif(posTotal,0) as GdpPerCase, Name FROM (SELECT TO_CHAR(refDate, 'MM-YYYY') AS Month, sum(posTotal) as posTotal, Name, gdp FROM Tests, State WHERE Tests.state=state.code AND (Name = :s1 OR Name = :s2) AND (TO_CHAR(REFDATE, 'YYYY-MM-DD') >= :d1 AND TO_CHAR(REFDATE, 'YYYY-MM-DD') <= :d2) GROUP BY TO_CHAR(refDate, 'MM-YYYY'), Name, gdp))",
                    {
                        s1: s1,
                        s2: s2,
                        d1: d1,
                        d2: d2,
                    }
                )
                break;
        }

        let response = {
            query: query,
            result: result,
            sets: sets,
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