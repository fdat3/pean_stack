import * as express from "express";
import * as bodyParser from "body-parser";
import * as session from "express-session";
import expressValidator = require("express-validator");
import { config } from "@/config";
import api from "./routers";
import * as cors from "cors";
import { scheduleService } from "./services";
import { sequelize } from "./models";
import * as path from "path";
import { engine } from 'express-handlebars';
const expressHbs = require("express-handlebars");


console.log("Starting server with at " + process.pid + " on port " + config.server.port);
/**
 * Express configuration.
 */
const app = express();
// sequelize.sync({force: false, alter: true});

app.set('view engine', 'ejs');
app.set('views', './views');


app.get("/policy", function (req, res) {
  res.render("policy");
});

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.database.sessionSecret,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressValidator());
app.use("/api/*", cors());
app.use("/api", api);
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
app.set("port", config.server.port);
app.get("/", function (request, response) {
  response.send('App is running');
}).listen(app.get("port"), function () {
  if (config.server.host === "localhost") {
    scheduleService.scheduleAll();
  }
  console.log(
    `${config.server.name} started at ${config.server.protocol}://${config.server.host}:${app.get("port")}`
  );
});
