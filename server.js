const express = require("express");
require("dotenv").config();
const cors = require("cors");
const oracledb = require("oracledb");
const bodyParser = require('body-parser');


const query = require("./routes/query");

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());
app.use(cors());

try {
    oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_19_10' });
    console.log("Connected to SQL Database");
} catch (err) {
    console.error(err);
    process.exit(1);
}

app.use("/api/query", query);

const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port}`));

module.exports = app;
