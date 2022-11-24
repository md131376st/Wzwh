var express = require("express");
var router = express.Router();

const ItemServices = require("../Services/ItemServices");
const ResultBuilder = require("../Modules/resultBuilder");

//All API implementation
/* GET: Return an array containing all Items */
router.get("/items", async function (req, res) {
  /* check permision: if not permision res.status(401) */

  let result = await new ItemServices().getAllItems();

  ResultBuilder.sendResult(result, res);
});
/* GET: Return an Item given ID */
router.get("/items/:id/:supplierId", async function (req, res) {
  /* check permision: if not permision res.status(401) */

  let result = await new ItemServices().getItemById(req.params.id, req.params.supplierId);

  ResultBuilder.sendResult(result, res);
});
/* POST: Create Item */
router.post("/item", async function (req, res) {
  /* check permision: if not permision res.status(401) */

  let result = await new ItemServices().createItem(req.body);

  ResultBuilder.sendResult(result, res);
});
/* PUT: Edit Item */
router.put("/item/:id/:supplierId", async function (req, res) {
  /* check permision: if not permision res.status(401) */

  let result = await new ItemServices().modifyItem(req.params.id, req.body, req.params.supplierId);

  ResultBuilder.sendResult(result, res);
});
/* DELETE: Delete Item */
router.delete("/items/:id/:supplierId", async function (req, res) {
  /* check permision: if not permision res.status(401) */

  let result = await new ItemServices().deleteItemById(req.params.id, req.params.supplierId);

  ResultBuilder.sendResult(result, res);
});

module.exports = router;
