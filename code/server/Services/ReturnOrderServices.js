const ReturnOrderDAO = require("../DAO/ReturnOrderDAO");
const RestockOrderDAO = require("../DAO/RestockOrderDAO");
const ReturnOrder = require("./Data/ReturnOrder");
const Response = require("../Modules/responses");
const DBTransactions = require("../DAO/DBTransactions");
const dbTransactions = new DBTransactions();


async function getReturnOrder(row) {
  let returnOrder = new ReturnOrder().fromDB(row);
  let productRows =
    await new ReturnOrderDAO().getAllProductsForAReturnOrderFromDB(
      returnOrder.id
    );
  returnOrder.assignProductsFromDB(productRows);
  return returnOrder;
}

class ReturnOrderServices {
  async getAllReturnOrders() {
    try {
      const returnOrderRows =
        await new ReturnOrderDAO().getAllReturnOrdersFromDB();
      const returnOrderList = [];

      let returnOrder;

      for (let row of returnOrderRows) {
        returnOrder = await getReturnOrder(row);
        returnOrderList.push(returnOrder);
      }

      return Response[200](returnOrderList.map((ro) => ro.intoAPIFormatWithID()));
    } catch (e) {
      return Response[500](e);
    }
  }

  async getReturnOrderById(id) {
    try {
      ReturnOrder.checkId(id);
    } catch (e) {
      return Response[422](e);
    }
    try {
      const rows = await new ReturnOrderDAO().getReturnOrderByIdFromDB(id);
      if (rows.length === 0)
        return Response[404]("No return order associated with id: " + id);
      let returnOrder = await getReturnOrder(rows[0]);
      return Response[200](returnOrder.intoAPIFormat());
    } catch (e) {
      return Response[500](e);
    }
  }

  async createReturnOrder(APIBody) {
    let newReturnOrder;
    try {
      newReturnOrder = new ReturnOrder().fromAPI(APIBody);
    } catch (e) {
      return Response[422](e);
    }

    try {
      const restockOrderRows =
        await new RestockOrderDAO().getRestockOrderByIdFromDB(
          newReturnOrder.restockOrderId
        );
      if (restockOrderRows.length === 0) {
        return Response[404](
          "No restock order associated with id: " + newReturnOrder.restockOrderId
        );
      }
      dbTransactions.beginTransaction();
    } catch (e) {
      return Response[503](e);
    }

    try {
      let returnOrderId = await new ReturnOrderDAO().createReturnOrderIntoDB(newReturnOrder.intoDBFormat());
      for (let product of newReturnOrder.products) {
        await new ReturnOrderDAO().addSkuItemToReturnOrderIntoDB(returnOrderId, product.rfid, product.skuId);
      }
      dbTransactions.commitTransaction();
      return Response[201]();
    } catch (e) {
      dbTransactions.rollbackTransaction();
      return Response[503](e);
    }
  }

  async deleteReturnOrderById(id) {
    try {
      ReturnOrder.checkId(id);
    } catch (e) {
      return Response[422](e);
    }

    try {
      await new ReturnOrderDAO().deleteReturnOrderByIdFromDB(id);
      return Response[204]();
    } catch (e) {
      return Response[503](e);
    }
  }
}

module.exports = ReturnOrderServices;
