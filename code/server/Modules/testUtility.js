const DBOperations = require("../DAO/DAOManager");

const db = new DBOperations();
class TestUtility{

	async deleteData(tableName) {
		const sql = 'DELETE FROM '+tableName;

		return await db.deleteFromDB(sql, []);
	}
}

module.exports = TestUtility;
