var express = require("express");
var router = express.Router();

const TestResultServices = require("../Services/TestResultServices");
const ResultBuilder = require("../Modules/resultBuilder");

router.get("/skuitems/:rfid/testResults", async function (req, res) {
  let result = await new TestResultServices().getAllTestResultForASkuItem(
    req.params.rfid
  );

  ResultBuilder.sendResult(result, res);
});

router.get("/skuitems/:rfid/testResults/:id", async function (req, res) {
  let result = await new TestResultServices().getTestResultForASkuItemById(
    req.params.id,
    req.params.rfid
  );

  ResultBuilder.sendResult(result, res);
});

router.post("/skuitems/testResult", async function (req, res) {
  let result = await new TestResultServices().createTestResult(req.body);

  ResultBuilder.sendResult(result, res);
});

router.put("/skuitems/:rfid/testResult/:id", async function (req, res) {
  let result = await new TestResultServices().modifyTestResultForASkuItemById(
    req.params.rfid,
    req.params.id,
    req.body
  );

  ResultBuilder.sendResult(result, res);
});

router.delete("/skuitems/:rfid/testResult/:id", async function (req, res) {
  let result = await new TestResultServices().deleteTestResultById(
    req.params.rfid,
    req.params.id
  );

  ResultBuilder.sendResult(result, res);
});

module.exports = router;
