const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const dotenv = require("dotenv");
dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const corsOptions = {
    origin: FRONTEND_URL
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use('', routes);

module.exports = app;