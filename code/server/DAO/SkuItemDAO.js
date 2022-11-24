const DBOperations = require("./DAOManager");

const db = new DBOperations();

class SkuItemDAO {

	async getAllSkuItemFromDB() {
		const sql = 'SELECT * FROM skuItem';
		return await db.fromDB(sql, []);

	}

	async getAllSkuItemWithASkuIdFromDB(skuId) {
		const sql = 'SELECT * FROM skuItem WHERE skuItem.sku=? AND skuItem.available =?';
		const args = [skuId, 1];

		return await db.fromDB(sql, args);
	}

	async getSKUItemByRFIDFromDB(rfid) {
		const sql = 'SELECT * FROM skuItem WHERE skuItem.rfid=?';
		const args = [rfid];

		return await db.fromDB(sql, args);

	}

	async createSKUItemIntoDB(skuItem) {
		const sql = 'INSERT INTO skuItem (rfid,available,sku,dateOfStock) VALUES(?,?,?,?)';
		const args = [skuItem.rfid, skuItem.available, skuItem.sku, skuItem.dateOfStock];

		let res = await db.intoDB(sql, args);
		return res.lastID;
	}

	async modifySKUItemIntoDB(skuItem, rfid) {
		const sql = 'UPDATE skuItem SET rfid=?, available=?, dateOfStock=? WHERE rfid=?'
		const args = [skuItem.rfid, skuItem.available, skuItem.dateOfStock, rfid];

		let res = await db.intoDB(sql, args);
		return res.lastID;
	}

	async deleteSKUItemByRFIDIntoDB(rfid) {
		const sql = 'DELETE FROM skuItem WHERE rfid = ?';
		const args = [rfid];

		let res = await db.deleteFromDB(sql, args);
		return res.lastID;
	}
}


module.exports = SkuItemDAO;
