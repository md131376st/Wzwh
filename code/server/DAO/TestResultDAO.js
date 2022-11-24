const DBOperations = require("./DAOManager");

const db = new DBOperations();

class TestResultDAO {
  constructor() {}

  async getAllTestResultForASkuItemFromDB(rfid) {
    let sql = "SELECT * FROM testResult WHERE skuitem = ?";
    let args = [rfid];
    return await db.fromDB(sql, args);
  }

  async getTestResultForASkuItemByIdFromDB(testResultId, rfid) {
    let sql = "SELECT * FROM testResult WHERE id = ? AND skuitem = ?";
    let args = [testResultId, rfid];
    return await db.fromDB(sql, args);
  }

  async createTestResultIntoDB(testResult) {
    let sql =
      "INSERT INTO testResult (date, result, testDescriptor, skuitem) VALUES (?, ?, ?, ?)";
    let args = [
      testResult.date,
      testResult.result,
      testResult.testDescriptor,
      testResult.skuitem
    ];
    return await db.intoDB(sql, args);
  }

  async modifyTestResultForASkuItemByIdIntoDB(rfid, testResultId, testResult) {
    let sql =
      "UPDATE testResult SET date = ?, result = ?, testDescriptor = ? WHERE id = ? AND skuitem = ?";
    let args = [
      testResult.date,
      testResult.result,
      testResult.testDescriptor,
      testResultId,
      rfid
    ];
    return await db.intoDB(sql, args);
  }

  async deleteTestResultByIdIntoDB(rfid, testResultId) {
    let sql = "DELETE FROM testResult WHERE id = ? AND skuitem = ?";
    let args = [testResultId, rfid];
    return await db.deleteFromDB(sql, args);
  }
}

module.exports = TestResultDAO;