const { Router } = require("express");
const router = Router()

router.get("/test", function (req:any, res:any) {
  res.send({
    msg: "Hello Webpack",
  });
});

module.exports =  {
  router
}