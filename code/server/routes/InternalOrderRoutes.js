var express = require("express");
var router = express.Router();

const InternalOrderServices = require("../Services/InternalOrderServices");
const ResultBuilder = require("../Modules/resultBuilder");

router.get("/internalOrders", async function (req, res) {
  let result = await new InternalOrderServices().getInternalOrders("ALL");

  ResultBuilder.sendResult(result, res);
});

router.get("/internalOrdersIssued", async function (req, res) {
  let result = await new InternalOrderServices().getInternalOrders("ISSUED");

  ResultBuilder.sendResult(result, res);
});

router.get("/internalOrdersAccepted", async function (req, res) {
  let result = await new InternalOrderServices().getInternalOrders("ACCEPTED");

  ResultBuilder.sendResult(result, res);
});

router.get("/internalOrders/:id", async function (req, res) {
  let result = await new InternalOrderServices().getInternalOrderById(
    req.params.id
  );

  ResultBuilder.sendResult(result, res);
});

router.post("/internalOrders", async function (req, res) {
  let result = await new InternalOrderServices().createInternalOrder(req.body);

  ResultBuilder.sendResult(result, res);
});

router.put("/internalOrders/:id", async function (req, res) {
  let result = await new InternalOrderServices().modifyState(
    req.params.id,
    req.body
  );

  ResultBuilder.sendResult(result, res);
});

router.delete("/internalOrders/:id", async function (req, res) {
  let result = await new InternalOrderServices().deleteInternalOrderById(
    req.params.id
  );

  ResultBuilder.sendResult(result, res);
});

module.exports = router;
