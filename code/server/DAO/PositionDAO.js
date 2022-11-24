const DBOperations = require("./DAOManager");

const db = new DBOperations();

class PositionDAO {

	async getAllPositionFromDB() {
		const sql = 'SELECT * FROM position';

		return await db.fromDB(sql, [])
	}

	async getPositionById(id) {
		const sql = 'SELECT * FROM position WHERE positionID = ?';
		const args = [id];
		return await db.fromDB(sql, args)
	}

	async createNewPositionIntoDb(position) {
		let sql = 'INSERT INTO position (positionID, aisle, row, col, \
            maxWeight, maxVolume, occupiedWeight, occupiedVolume) VALUES (?,?,?,?,?,?,?,?)'

		let args = [position.positionID, position.aisle, position.row, position.col,
			position.maxWeight, position.maxVolume, position.occupiedWeight, position.occupiedVolume]

		const res = await db.intoDB(sql, args);
		return res.lastID;
	}

	async modifyPositionIntoDB(position, id) {
		const sql = 'UPDATE position SET positionID=?, aisle=?, row=?, col=?, maxWeight=?, maxVolume=?, occupiedWeight=?, occupiedVolume=? \
                    WHERE positionID=?';

		const args = [position.positionID, position.aisle, position.row, position.col, position.maxWeight, position.maxVolume, position.occupiedWeight, position.occupiedVolume, id];

		const res = await db.intoDB(sql, args);
		return res.lastID;
	}

	async modifyPositionIDIntoDb(id, position) {
		const sql = 'UPDATE position SET positionID=?, aisle=?, row=?, col=? WHERE positionID=?';
		const args = [position.positionID, position.aisle, position.row, position.col, id];

		let res = await db.intoDB(sql, args);
		return res.lastID;
	}

	async deletePositionByIdIntoDB(id) {
		const sql = 'DELETE FROM position WHERE positionID = ?';
		const args = [id];

		let res = await db.deleteFromDB(sql, args);
		return res.lastID;
	}

	async isPositionAssignedIntoDB(id) {
		const sql = 'SELECT * FROM sku WHERE sku.position = ?';
		const args = [id];
		return ((await db.fromDB(sql, args)).length !== 0)
	}


}


module.exports = PositionDAO;
