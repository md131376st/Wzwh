const InternalOrderDAO = require("../DAO/InternalOrderDAO");
const InternalOrder = require("./Data/InternalOrder");
const PositionDAO = require("../DAO/PositionDAO");
const SkuDAO = require("../DAO/SkuDAO");
const SkuItemDAO = require("../DAO/SkuItemDAO");
const SkuItem = require("./Data/SkuItem");
const Position = require("./Data/Position");
const Sku = require("./Data/Sku");
const Response = require("../Modules/responses");
const DBTransactions = require("../DAO/DBTransactions");
const dbTransactions = new DBTransactions();

async function updateSkuAndPosition(product, sign) {
  let skuRows = await new SkuDAO().getSKUByIDFromDB(product.skuId);
  if (skuRows.length === 0)
    return "No sku with id: " + product.skuId;
  let sku = new Sku().fromDB(skuRows[0]);
  let newSkuAvailableQuantity = sku.availableQuantity + sign * product.quantity;
  if (newSkuAvailableQuantity < 0)
    return "No enought availability for sku with id: " + sku.id;
  sku.setAvailableQuantity(newSkuAvailableQuantity);
  await new SkuDAO().modifySkuIntoDB(sku.intoDBFormat(), sku.id);
  let posRows = await new PositionDAO().getPositionById(sku.position);
  if (posRows.length === 0)
    return "No position with id: " + sku.position;
  let pos = new Position().fromDB(posRows[0])
  let newWeight = sku.weight * newSkuAvailableQuantity;
  let newVolume = sku.volume * newSkuAvailableQuantity;
  pos.setOccupation(newVolume, newWeight);
  await new PositionDAO().modifyPositionIntoDB(pos.intoDBFormat(), pos.positionID);
  return "OK";
}

async function getInternalOrder(rawInternalOrder) {
  let internalOrder = new InternalOrder().FromDB(rawInternalOrder);
  let skuRows = await new InternalOrderDAO().getAllSkuForInternalOrderFromDB(
    internalOrder.id
  );
  let skuItemRows =
    await new InternalOrderDAO().getAllSkuItemsForInternalOrderFromDB(
      internalOrder.id
    );
  internalOrder.assignProductsFromDB(skuRows, skuItemRows);
  return internalOrder;
}

class InternalOrderServices {
  async getInternalOrders(filter) {
    try {
      const rows = await new InternalOrderDAO().getInternalOrdersFromDB(filter);
      let internalOrders = [];
      for (let row of rows) {
        internalOrders.push(await getInternalOrder(row));
      }

      return Response[200](internalOrders.map((o) => o.intoAPIFormat()));

    } catch (e) {
      return Response[500](e);
    }
  }

  async getInternalOrderById(id) {
    try {
      InternalOrder.checkId(id);
    } catch (e) {
      return Response[422](e);
    }

    try {
      const row = await new InternalOrderDAO().getInternalOrdersFromDB(
        "ID",
        id
      );
      if (row.length == 0)
        return Response[404]("No internal order associated to id: " + id);

      let internalOrder = await getInternalOrder(row[0]);
      return Response[200](internalOrder.intoAPIFormat());
    } catch (e) {
      return Response[500](e);
    }
  }

  async createInternalOrder(rawInternalOrder) {
    let internalOrder;
    try {
      internalOrder = new InternalOrder().FromAPI(rawInternalOrder);
    } catch (e) {
      return Response[422](e);
    }

    try {
      await dbTransactions.beginTransaction();
    } catch (e) {
      return Response[503](e);
    }

    try {
      internalOrder.setNewState("ISSUED");
      let internalOrderID = await new InternalOrderDAO().createInternalOrder(
        internalOrder.toDBFormat()
      );
      //let res;
      for (let product of internalOrder.products) {
        /*
        res = await updateSkuAndPosition(product, -1);
        if(res!=="OK")
          return Response[422](res);
        */
        await new InternalOrderDAO().addSkuToInternalOrderIntoDB(
          internalOrderID,
          product.skuId,
          product.quantity
        );
      }
      dbTransactions.commitTransaction();
      return Response[201]();
    } catch (e) {
      await dbTransactions.rollbackTransaction();
      return Response[503](e);
    }
  }

  async modifyState(id, reqBody) {
    let internalOrder;

    try {
      InternalOrder.checkId(id);
      internalOrder = new InternalOrder().fromAPIPModify(reqBody)

    } catch (e) {
      return Response[422](e);
    }

    try {
      const rows = await new InternalOrderDAO().getInternalOrdersFromDB(
        "ID",
        id
      );
      if (rows.length == 0)
        return Response[404]("No internal order associated to id: " + id);

      await dbTransactions.beginTransaction();
    } catch (e) {
      return Response[503](e);
    }

    try {
      await new InternalOrderDAO().modifyInternalOrderStateIntoDB(
        id,
        internalOrder.state
      );

      if (internalOrder.state === "COMPLETED") {
        for (let product of internalOrder.products) {
          await new InternalOrderDAO().addSkuItemToInternalOrderIntoDB(
            id,
            product.rfid,
            product.skuId
          );
        }
      }

      dbTransactions.commitTransaction();
      return Response[200]();
    } catch (e) {
      dbTransactions.rollbackTransaction();
      return Response[503](e);
    }
  }

  async deleteInternalOrderById(id) {
    try {
      InternalOrder.checkId(id);
    } catch (e) {
      return Response[422](e);
    }

    try {
      await new InternalOrderDAO().deleteInternalOrderByIdIntoDB(id);
      return Response[204]();
    } catch (e) {
      return Response[503](e);
    }
  }
}

module.exports = InternalOrderServices;
