var express = require('express');
var router = express.Router();

const RestockOrderServices = require('../Services/RestockOrderServices')
const ResultBuilder = require("../Modules/resultBuilder");

/* GET: Return an array containing all restock orders */
router.get('/restockOrders', async function (req, res) {

    let result = await new RestockOrderServices().getAllRestockOrder();

    ResultBuilder.sendResult(result, res);
});

/* GET: Returns an array of all restock orders in state = ISSUED */
router.get('/restockOrdersIssued', async function (req, res) {

    let result = await new RestockOrderServices().getAllRestockOrder("ISSUED");

    ResultBuilder.sendResult(result, res);
});


/* GET: Return a restock order, given its id */
router.get('/restockOrders/:id', async function (req, res) {

    let result = await new RestockOrderServices().getRestockOrderById(req.params.id);

    ResultBuilder.sendResult(result, res);
});

/* GET: Return sku items to be returned of a restock order, given its id. 
    A sku item need to be returned if it haven't passed at least one quality test */
    router.get('/restockOrders/:id/returnItems', async function (req, res) {

    let result = await new RestockOrderServices().getAllSkuItemsToBeReturned(req.params.id);

    ResultBuilder.sendResult(result, res);
});

/* POST: Creates a new restock order in state = ISSUED with an empty list of skuItems */
router.post('/restockOrder', async function (req, res) {

    let result = await new RestockOrderServices().createRestockOrder(req.body);

    ResultBuilder.sendResult(result, res);
});

/* PUT: Modify the state of a restock order, given its id */
router.put('/restockOrder/:id', async function (req, res) {

    let result = await new RestockOrderServices().modifyState(req.params.id, req.body);

    ResultBuilder.sendResult(result, res);
});

/* PUT: Add a non empty list of skuItems to a restock order, given its id. 
    If a restock order has already a non empty list of skuItems, merge both arrays */
router.put('/restockOrder/:id/skuItems', async function (req, res) {

    let result = await new RestockOrderServices().addSkuItemsToRestockOrder(req.params.id, req.body);

    ResultBuilder.sendResult(result, res);
});

/* PUT: Add a transport note to a restock order, given its id */
router.put('/restockOrder/:id/transportNote', async function (req, res) {

    let result = await new RestockOrderServices().addTransportNote(req.params.id, req.body);

    ResultBuilder.sendResult(result, res);
});

/* DELETE: Delete a restock order, given its id */
router.delete('/restockOrder/:id', async function (req, res) {

    let result = await new RestockOrderServices().deleteRestockOrderById(req.params.id);

    ResultBuilder.sendResult(result, res);
});


module.exports = router;