const dbname = "EzWh.db";
const DBOperations = require("./DAOManager");
const db = new DBOperations();

class ReturnOrderDAO {
  async getAllReturnOrdersFromDB() {
    const sql = "SELECT * FROM returnOrder";
    return await db.fromDB(sql, []);
  }

  async getReturnOrderByIdFromDB(Id) {
    const sql = "SELECT * FROM returnOrder WHERE returnOrder.id = ?";
    const args = [Id];

    return await db.fromDB(sql, args);
  }

  async createReturnOrderIntoDB(ReturnOrder) {
    const sql =
      "INSERT INTO returnOrder ( returnDate, restockOrder ) VALUES (?,?)";
    const args = [ReturnOrder.returnDate, ReturnOrder.restockOrder];

    let res = await db.intoDB(sql, args);
    return res.lastID;
  }

  async deleteReturnOrderByIdFromDB(returnOrderID) {
    const sql = "DELETE FROM returnOrder WHERE returnOrder.id = ?";
    const args = [returnOrderID];

    let res = await db.deleteFromDB(sql, args);
    return res.lastID;
  }
  async getAllProductsForAReturnOrderFromDB(returnOrderId) {
    const sql =
      "SELECT sku.id as sku, skuItem.rfid as rfid, sku.description as description, sku.prices as prices, item.id as itemId FROM sku, \
      item JOIN skuItem ON item.sku = skuItem.sku WHERE sku.id = skuItem.sku AND skuItem.returnOrder = ?";

    const args = [returnOrderId];

    return await db.fromDB(sql, args);
  }

  async addSkuItemToReturnOrderIntoDB(returnOrderId, rfid, skuId) {
    let sql;
    let args;
    
    sql = "UPDATE skuItem SET returnOrder = ?  WHERE rfid = ? AND sku = ?";

    args = [returnOrderId, rfid, skuId];

    await db.intoDB(sql, args);

    return "OK";
  }
}

module.exports = ReturnOrderDAO;
