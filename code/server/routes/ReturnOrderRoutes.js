var express = require("express");
var router = express.Router();

const ReturnOrderServices = require("../Services/ReturnOrderServices");
const ItemServices = require("../Services/ItemServices");
const ResultBuilder = require("../Modules/resultBuilder");

//All API implementation
router.get("/returnOrders", async function (req, res) {
  /* check permision: if not permision res.status(401) */

  let result = await new ReturnOrderServices().getAllReturnOrders();

  ResultBuilder.sendResult(result, res);
});
router.get("/returnOrders/:id", async function (req, res) {
  /* check permision: if not permision res.status(401) */

  let result = await new ReturnOrderServices().getReturnOrderById(
    req.params.id
  );

  ResultBuilder.sendResult(result, res);
});
router.post("/returnOrder", async function (req, res) {
  /* check permision: if not permision res.status(401) */

  let result = await new ReturnOrderServices().createReturnOrder(req.body);

  ResultBuilder.sendResult(result, res);
});
router.delete("/returnOrder/:id", async function (req, res) {
  /* check permision: if not permision res.status(401) */

  let result = await new ReturnOrderServices().deleteReturnOrderById(
    req.params.id
  );

  ResultBuilder.sendResult(result, res);
});

module.exports = router;
