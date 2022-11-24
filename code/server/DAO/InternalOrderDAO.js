const DBOperations = require("./DAOManager");

const db = new DBOperations();

class InternalOrderDAO {
  constructor() {}

  async getInternalOrdersFromDB(filter, id) {
    let sql;

    let args = [];

    switch (filter) {
      case "ALL":
        sql = "SELECT * FROM internalOrder";
        break;

      case "ISSUED":
        sql = 'SELECT * FROM internalOrder WHERE state="ISSUED"';
        break;

      case "ACCEPTED":
        sql = 'SELECT * FROM internalOrder WHERE state="ACCEPTED"';
        break;

      case "ID":
        if (id === undefined)
          Error("Id parameter is required when searching by id");
        sql = "SELECT * FROM internalOrder WHERE id=?";
        args.push(id);
        break;

      default:
        Error("Invalid parameter filter for getInternalOrderFromDB function");
        break;
    }
    return await db.fromDB(sql, args);
  }

  async createInternalOrder(internalOrder) {
    let sql =
      "INSERT INTO internalOrder (date, state, fromCustomer) VALUES (?, ?, ?)";
      let args = [
        internalOrder.date,
        internalOrder.state,
        internalOrder.fromCustomer,
      ];

    const res = await db.intoDB(sql, args);

    return res.lastID;
  }

  async addSkuToInternalOrderIntoDB(internalOrderID, skuID, quantity) {
    let sql =
      "INSERT INTO internalOrderSku (internalOrder, sku, quantity) VALUES (?, ?, ?)";

    let args = [internalOrderID, skuID, quantity];

    let res = await db.intoDB(sql, args);

    return res.lastID;
  }

  async modifyInternalOrderStateIntoDB(id, state) {
    const sql = "UPDATE internalOrder SET state=? WHERE id=?";

    const args = [state, id];

    const queryRes = await db.intoDB(sql, args);

    return queryRes.lastID;
  }

  async deleteInternalOrderByIdIntoDB(id) {
    const sql = "DELETE FROM internalOrder WHERE id=?";

    const args = [id];

    const queryRes = await db.deleteFromDB(sql, args);

    return queryRes.lastID;
  }

  async getAllSkuForInternalOrderFromDB(id) {
    let sql =
      "SELECT * FROM internalOrderSku, sku WHERE internalOrderSku.internalOrder=? AND internalOrderSku.sku = sku.id";

    const args = [id];

    return await db.fromDB(sql, args);
  }

  async addSkuItemToInternalOrderIntoDB(internalOrderId, rfid, skuId) {
    let sql;
    let args;

    sql = "UPDATE skuItem SET internalOrder = ? WHERE rfid = ? AND sku = ?";

    args = [internalOrderId, rfid, skuId];

    await db.intoDB(sql, args);

    return "OK";
  }

  async getAllSkuItemsForInternalOrderFromDB(internalOrderId) {
    const sql = "SELECT *, sku FROM skuItem WHERE internalOrder = ?";

    const args = [internalOrderId];

    return await db.fromDB(sql, args);
  }
  async deleteData() {
    const sql = 'DELETE FROM internalOrder';

    return await db.deleteFromDB(sql, []);
  }
}

module.exports = InternalOrderDAO;
