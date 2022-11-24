var express = require("express");
const { Result } = require("express-validator");
var router = express.Router();

const SkuItemServices = require("../Services/SkuItemServices");
const ResultBuilder = require("../Modules/resultBuilder");

//All API implementation

router.get("/skuitems", async function (req, res) {
  let result = await new SkuItemServices().getAllSKUItem();

  ResultBuilder.sendResult(result, res);
});

router.get("/skuitems/sku/:id", async function (req, res) {
  let result = await new SkuItemServices().getAllSKUItemWithASkuId(
    req.params.id
  );

  ResultBuilder.sendResult(result, res);
});

router.get("/skuitems/:rfid", async function (req, res) {
  let result = await new SkuItemServices().getSKUItemByRFID(req.params.rfid);

  ResultBuilder.sendResult(result, res);
});

router.post("/skuitem", async function (req, res) {
  let result = await new SkuItemServices().createSKUItem(req.body);

  ResultBuilder.sendResult(result, res);
});

router.put("/skuitems/:rfid", async function (req, res) {
  let result = await new SkuItemServices().modifySKUItem(
    req.params.rfid,
    req.body
  );

  ResultBuilder.sendResult(result, res);
});

router.delete("/skuitems/:rfid", async function (req, res) {
  let result = await new SkuItemServices().deleteSkuItemByRFID(req.params.rfid);

  ResultBuilder.sendResult(result, res);
});

module.exports = router;
