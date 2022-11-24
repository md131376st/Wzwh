var express = require("express");
var router = express.Router();

const PositionServices = require("../Services/PositionServices");
const ResultBuilder = require("../Modules/resultBuilder");

/* GET: Return an array containing all positions */
router.get("/positions", async function (req, res) {
  let result = await new PositionServices().getAllPositions();

  ResultBuilder.sendResult(result, res);
});

/* POST: Creates a new Position. */
router.post("/position", async function (req, res) {
  let result = await new PositionServices().createPosition(req.body);

  ResultBuilder.sendResult(result, res);
});

/* PUT: Modify a position identified by positionID */
router.put("/position/:positionID", async function (req, res) {
  let result = await new PositionServices().modifyPositionById(
    req.params.positionID,
    req.body
  );

  ResultBuilder.sendResult(result, res);
});

/* PUT: Modify the positionID of a position position, given its old positionID */
router.put("/position/:positionID/changeID", async function (req, res) {
  let result = await new PositionServices().modifyPositionId(
    req.params.positionID,
    req.body
  );

  ResultBuilder.sendResult(result, res);
});

/* DELETE: Delete a SKU item receiving his positionID */
router.delete("/position/:positionID", async function (req, res) {
  let result = await new PositionServices().deletePositionById(
    req.params.positionID
  );

  ResultBuilder.sendResult(result, res);
});
module.exports = router;
