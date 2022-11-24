var express = require("express");
var router = express.Router();

const SkuServices = require("../Services/SkuServices");
const ResultBuilder = require("../Modules/resultBuilder");

/*GET: Return an array containing all SKUs*/
router.get("/skus", async function (req, res) {
  let result = await new SkuServices().getAllSku();

  ResultBuilder.sendResult(result, res);
});

router.get("/skus/:id", async function (req, res) {
  let result = await new SkuServices().getSKUByID(req.params.id);

  ResultBuilder.sendResult(result, res);
});

router.post("/sku", async function (req, res) {
  let result = await new SkuServices().createSku(req.body);

  ResultBuilder.sendResult(result, res);
});

router.put("/sku/:id", async function (req, res) {
  let result = await new SkuServices().modifySKU(req.params.id, req.body);

  ResultBuilder.sendResult(result, res);
});

router.put("/sku/:id/position", async function (req, res) {
  let result = await new SkuServices().modifySkuPosition(
    req.params.id,
    req.body
  );

  ResultBuilder.sendResult(result, res);
});

router.delete("/skus/:id", async function (req, res) {
  let result = await new SkuServices().deleteSku(req.params.id);

  ResultBuilder.sendResult(result, res);
});

module.exports = router;
