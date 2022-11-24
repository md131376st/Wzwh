const DBOperations = require("./DAOManager");

const db = new DBOperations();

class TestDescriptorDAO {
  constructor() {}

  async getAllTestDescriptorFromDB() {
    let sql = "SELECT * FROM testDescriptor";
    let args = [];
    return await db.fromDB(sql, args);
  }

  async getTestDescriptorByIdFromDB(id) {
    let sql = "SELECT * FROM testDescriptor WHERE id = ?";
    let args = [id];
    return await db.fromDB(sql, args);
  }

  async createTestDescriptorIntoDB(testDescriptor) {
    let sql =
      "INSERT INTO testDescriptor (name, procedureDescription, sku) VALUES (?, ?, ?)";
    let args = [
      testDescriptor.name,
      testDescriptor.procedureDescription,
      testDescriptor.sku,
    ];
    return await db.intoDB(sql, args);
  }

  async modifyTestDescriptorByIdIntoDB(id, testDescriptor) {
    let sql =
      "UPDATE testDescriptor SET name = ?, procedureDescription = ?, sku = ?  WHERE id = ?";
    let args = [
      testDescriptor.name,
      testDescriptor.procedureDescription,
      testDescriptor.sku,
      id
    ];
    return await db.intoDB(sql, args);
  }

  async deleteTestDescriptorByIdIntoDB(id) {
    let sql = "DELETE FROM testDescriptor WHERE id = ?";
    let args = [id];
    return await db.deleteFromDB(sql, args);
  }
}

module.exports = TestDescriptorDAO;
