const DBOperations = require("./DAOManager");

const db = new DBOperations();

class RestockOrderDAO {
    async getAllRestockOrderFromDB(issued) {
        let sql;
        if (issued)
            sql = 'SELECT * FROM restockOrder WHERE state="ISSUED"';
        else
            sql = 'SELECT * FROM restockOrder';

        return await db.fromDB(sql, []);
    }

    async getTransportNoteFromDB(id) {
        const sql = 'SELECT * FROM transportNote WHERE id=?';
        const args = [id];

        return await db.fromDB(sql, args);

    }

    async getAllSkuItemForRestockOrderFromDB(restockOrderId) {
        const sql = 'SELECT rfid, item.sku, item.id as itemId  FROM item JOIN skuItem ON skuItem.sku = item.sku  WHERE restockOrder = ? ';
        const args = [restockOrderId];

        return await db.fromDB(sql, args);
    }

    async checkTestResult(skuItemId) {
        const sql = 'SELECT * FROM testResult WHERE skuitem = ? AND result = 0';
        const args = [skuItemId];

        return await db.fromDB(sql, args);
    }

    async getAllProductsForRestockOrderFromDB(restockOrderId) {
        const sql = 'SELECT * FROM restockOrderItem WHERE restockOrder = ?';
        const args = [restockOrderId];

        return await db.fromDB(sql, args);
    }

    async getRestockOrderByIdFromDB(id) {

        const sql = 'SELECT * FROM restockOrder WHERE id=?';
        const args = [id];

        return await db.fromDB(sql, args);
    }


    async createNewRestockOrderIntoDb(restockOrder) {
        const sql = 'INSERT INTO restockOrder (issueDate, state, supplier) VALUES (?, ?, ?)';
        const args = [restockOrder.issueDate, restockOrder.state, restockOrder.supplier];

        let res = await db.intoDB(sql, args);
        return res.lastID;
    }


    async modifyStateIntoDb(id, state) {
        const sql = 'UPDATE restockOrder SET state=? WHERE id=?'
        const args = [state, id];

        let res = await db.intoDB(sql, args);
        return res.lastID;
    }

    async addTransportNoteIntoDb(transportNote) {
        const sql = 'INSERT INTO transportNote (shipmentDate) VALUES (?)'
        const args = [transportNote.shipmentDate];

        let res = await db.intoDB(sql, args);
        return res.lastID;

    }

    async addTransportNoteToROIntoDb(id, last_id) {
        const sql = 'UPDATE restockOrder SET transportNote=? WHERE id=?'
        const args = [last_id, id];

        let res = await db.intoDB(sql, args);
        return res.lastID;
    }

    async deleteRestockOrderByIdIntoDB(id) {
        const sql = 'DELETE FROM restockOrder WHERE id = ?';
        const args = [id];

        let res = await db.deleteFromDB(sql, args);
        return res.lastID;
    }

    async addSkuItemToRestockOrderIntoDB(skuid, rfid, id) {
        const sql = 'UPDATE skuItem SET restockOrder=? WHERE rfid=? AND sku=?'
        const args = [id, rfid, skuid];

        let res = await db.intoDB(sql, args);
        return res.changes;
    }

    async getItemBySkuAndSupplierFromDB(skuId, supplierId){
        const sql = 'SELECT * FROM item WHERE sku=? AND supplier=?';
        const args = [skuId, supplierId];

        return await db.fromDB(sql, args);
    }

    async addItemToARestockOrder(itemId, roId, quantity, supplier){
        const sql = 'INSERT INTO restockOrderItem (restockOrder, item, quantity, supplierId) VALUES (?,?,?,?)'
        const args = [roId, itemId, quantity, supplier];

        let res = await db.intoDB(sql, args);
        return res.lastID;
    }
}


module.exports = RestockOrderDAO;