const testRouter = require("./router/test");

const express = require("express");

const ServerApplication = express();



ServerApplication.use("/api", testRouter.router)

module.exports = {
  ServerApplication,
};
