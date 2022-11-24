const DBOperations = require("./DAOManager");

const db = new DBOperations();

class SkuDAO {
  async getAllSkuFromDB() {
    const sql =
      "SELECT sku.id as id, description, weight, volume, prices, notes, position, availableQuantity, testDescriptor.id as testDescriptor FROM sku LEFT JOIN testDescriptor ON sku.id = testDescriptor.sku";
    return await db.fromDB(sql, []);
  }

  async getSKUByIDFromDB(Id) {
    const sql =
      "SELECT sku.id as id, description, weight, volume, prices, notes, position, availableQuantity, testDescriptor.id as testDescriptor FROM sku LEFT JOIN testDescriptor ON sku.id = testDescriptor.sku WHERE sku.id = ?";
    const args = [Id];
    return await db.fromDB(sql, args);
  }

  async createNewSkuIntoDB(Sku) {
    const sql =
      "INSERT INTO sku(description,weight,volume,prices,notes,availableQuantity) VALUES(?,?,?,?,?,?)";
    const args = [
      Sku.description,
      Sku.weight,
      Sku.volume,
      Sku.prices,
      Sku.notes,
      Sku.availableQuantity,
    ];

    let res = await db.intoDB(sql, args);
    return res.lastID;
  }

  async modifySkuIntoDB(sku, id) {
    const sql =
      "UPDATE sku SET description=?, weight=?,volume=?,prices=?,notes=?,availableQuantity=? WHERE id=?";
    const args = [
      sku.description,
      sku.weight,
      sku.volume,
      sku.prices,
      sku.notes,
      sku.availableQuantity,
      id,
    ];

    let res = await db.intoDB(sql, args);
    return res.changes;
  }

  async modifySkuPositionIntoDB(id, positionId) {
    const sql = "UPDATE sku SET position=? WHERE sku.id=?";
    const args = [positionId, id];

    let res = await db.intoDB(sql, args);
    return res.changes;
  }

  async deleteSkuByIdIntoDB(id) {
    const sql = "DELETE FROM sku WHERE id=?";
    const args = [id];

    let res = await db.deleteFromDB(sql, args);
    return res.lastID;
  }


}

module.exports = SkuDAO;
