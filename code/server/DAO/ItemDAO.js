const DBOperations = require("./DAOManager");

const db = new DBOperations();

class ItemDAO {

	async getAllItemsFromDB() {
		const sql = 'SELECT * FROM Item  ';
		return await db.fromDB(sql, []);
	}

	async getItemByIdFromDB(itemId, supplierId) {
		const sql = 'SELECT * FROM Item WHERE id = ? AND supplier = ?  ';
		const args = [itemId, supplierId];

		return await db.fromDB(sql, args);
	}

	async createItemIntoDB(item) {
		const sql = 'INSERT INTO item (id, description, price, sku, supplier ) VALUES (?,?,?,?,?)';
		const args = [item.id, item.description, item.price, item.sku, item.supplier]

		let res = await db.intoDB(sql, args);
		return res.lastID;
	}


	async supplierSellSku(suplierID, skuID) {
		const sql = 'SELECT id FROM item WHERE supplier = ? and sku = ?  ';
		const args = [suplierID, skuID];

		let res = await db.fromDB(sql, args);
		return (res.length !== 0);
	}

	async modifyItemIntoDB(itemId, newItem, supplierId) {
		const sql = 'UPDATE item SET description = ?, price = ?   WHERE id = ? AND supplier = ?'
		const args = [newItem.description, newItem.price, itemId, supplierId];

		let res = await db.intoDB(sql, args);
		return res.lastID;
	}

	async deleteItemByIdFromDB(itemId, supplierId) {
		const sql = 'DELETE FROM item WHERE id = ? AND supplier = ?';
		const args = [itemId, supplierId];

		let res = await db.deleteFromDB(sql, args);
		return res.lastID;
	}

}


module.exports = ItemDAO;
