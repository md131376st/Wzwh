var express = require("express");
var router = express.Router();

const TestDescriptorServices = require("../Services/TestDescriptorServices");
const ResultBuilder = require("../Modules/resultBuilder");

router.get("/testDescriptors", async function (req, res) {
  let result = await new TestDescriptorServices().getAllTestDescriptor();

  ResultBuilder.sendResult(result, res);
});

router.get("/testDescriptors/:id", async function (req, res) {
  let result = await new TestDescriptorServices().getTestDescriptorById(
    req.params.id
  );

  ResultBuilder.sendResult(result, res);
});

router.post("/testDescriptor", async function (req, res) {
  let result = await new TestDescriptorServices().createTestDescriptor(req.body);

  ResultBuilder.sendResult(result, res);
});

router.put("/testDescriptor/:id", async function (req, res) {
  let result = await new TestDescriptorServices().modifyTestDescriptorById(
    req.params.id,
    req.body
  );

  ResultBuilder.sendResult(result, res);
});

router.delete("/testDescriptor/:id", async function (req, res) {
  let result = await new TestDescriptorServices().deleteTestDescriptorById(
    req.params.id
  );

  ResultBuilder.sendResult(result, res);
});

module.exports = router;
