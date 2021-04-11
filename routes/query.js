require("dotenv").config();
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const connectString = process.env.DB_CONNECTSTRING;

router.route("/").post(async function(req, res) {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: username,
            password: password,
            connectString: connectString,
        })

        const result = await connection.execute(
            `SELECT COUNT(*) FROM CDC`
        );
        res.json(result);
    } catch (err) {
        console.error(err);
    }
})

module.exports = router;