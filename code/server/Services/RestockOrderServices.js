const RestockOrderDAO = require('../DAO/RestockOrderDAO')
const ItemDAO = require('../DAO/ItemDAO')
const RestockOrder = require('./Data/RestockOrder');
const SkuItem = require('./Data/SkuItem');
const Item = require('./Data/Item');
const TransportNote = require('./Data/TransportNote')
const DBTransactions = require("../DAO/DBTransactions");
const dbTransactions = new DBTransactions();
const Response = require("../Modules/responses");
const SkuDAO = require('../DAO/SkuDAO');
const ItemServices = require('./ItemServices');

class RestockOrderServices {

	async getRestockOrder(restockOrder, withID) {
		let t = await this.getTransportNote(restockOrder.transportNote);
		let s = await this.getAllSkuItemForRestockOrder(restockOrder.id);
		let p = await this.getAllProductsForRestockOrder(restockOrder.id);
		let r = new RestockOrder().intoAPIFormat(restockOrder, t, s, p, withID);
		return r;
	}

	/*
	async getReturnProduct(restockOrderId) {
		let s = await this.getAllSkuItemForRestockOrder(restockOrderId);
		s.map((item) => {
			item.RFID = item.rfid;
			return delete item.rfid;
		});
		let p = await this.getAllProductsForReturnOrder(restockOrderId);
		return p.map((item, i) => {
			if (item.sku === s[i].sku) {
				return Object.assign({}, item, s[i])
			}
		})
	}*/

	async getAllRestockOrder(issued) {
		try {
			const restockOrderList = await new RestockOrderDAO().getAllRestockOrderFromDB(issued);
			let result = []

			for (let i = 0; i < restockOrderList.length; i++) {
				let r = await this.getRestockOrder(new RestockOrder().fromDB(restockOrderList[i]), true);
				result.push(r);
			}

			return Response[200](result);
		} catch {
			return Response[500]();
		}
	}

	async getAllSkuItemsToBeReturned(id) {
		try {
			RestockOrder.checkId(id);

			const row = await new RestockOrderDAO().getRestockOrderByIdFromDB(id);
			if (row.length == 0)
				return Response[404]("No restock order associated to id");


			if (row[0].state != "COMPLETEDRETURN")
				return Response[422]("Order is not in COMPLETED RETURN status");

		} catch (e) {
			return Response[500](e);
		}

		try {
			const skuItems = await new RestockOrderDAO().getAllSkuItemForRestockOrderFromDB(id);
			let result = [];

			for (let i = 0; i < skuItems.length; i++) {

				let testsFailed = await new RestockOrderDAO().checkTestResult(skuItems[i].rfid);
				if (testsFailed.length > 0)
					result.push(new SkuItem().skuItemForRestockOrderIntoAPIFormat(skuItems[i]))

			}
			return Response[200](result);

		} catch (e) {
			return Response[500](e);
		}
	}

	async getTransportNote(id) {
		if (id) {
			const transportNote = await new RestockOrderDAO().getTransportNoteFromDB(id);
			return new TransportNote().fromDB(transportNote[0]).intoAPIFormat();
		} else
			return null;
	}

	async getAllSkuItemForRestockOrder(restockOrderId) {
		let skuItems = await new RestockOrderDAO().getAllSkuItemForRestockOrderFromDB(restockOrderId);
		let result = [];
		for (let i = 0; i < skuItems.length; i++) {
			let skuItem = new SkuItem().skuItemForRestockOrderIntoAPIFormat(skuItems[i]);
			result.push(skuItem);
		}
		return result;
	}

	async getAllProductsForRestockOrder(restockOrderId) {
		let products = await new RestockOrderDAO().getAllProductsForRestockOrderFromDB(restockOrderId);
		let result = [];
		for (let i = 0; i < products.length; i++) {
			let it = await new ItemDAO().getItemByIdFromDB(products[i].item, products[i].supplierId);
			if (it.length > 0) {
				let item = new Item().itemForRestockOrder(it[0], products[i].quantity);
				result.push(item);
			}
		}
		return result;
	}

	/*
	async getAllProductsForReturnOrder(restockOrderId) {
		let products = await new RestockOrderDAO().getAllProductsForRestockOrderFromDB(restockOrderId);
		let result = [];
		for (let i = 0; i < products.length; i++) {
			let item = new Item().itemForReturnOrder((await new ItemDAO().getItemByIdFromDB(products[i].item))[0]);
			result.push(item);
		}
		return result;
	}*/

	async getRestockOrderById(id) {
		try {
			RestockOrder.checkId(id);
		} catch (e) {
			return Response[422](e);
		}

		try {
			const row = await new RestockOrderDAO().getRestockOrderByIdFromDB(id);
			if (row.length == 0)
				return { status: 404, error: "No restock order associated to id: " + id }

			let restockOrder = await this.getRestockOrder(new RestockOrder().fromDB(row[0]));
			return Response[200](restockOrder);
		} catch (e) {
			return Response[500](e);
		}
	}


	async createRestockOrder(reqBody) {
		let new_ro;

		try {
			new_ro = new RestockOrder().fromAPI(reqBody);
		} catch (e) {
			return Response[422](e);
		}

		try {
			dbTransactions.beginTransaction();
		} catch {
			return Response[503]();
		}

		try {
			let roid = await new RestockOrderDAO().createNewRestockOrderIntoDb(new_ro.intoDBFormat());

			/* ADDING ITEM */
			for (let p of new_ro.products) {
				/*let item = await new RestockOrderDAO().getItemBySkuAndSupplierFromDB(p.skuId, new_ro.supplierId);
				if (item.length == 0)
					throw new Error("Item not found");*/
				const rows = await new ItemDAO().getItemByIdFromDB(p.itemId, new_ro.supplierId);
				if (rows.length === 0){
					dbTransactions.rollbackTransaction();
					return Response[422]("No item associated with the id");
				}

				const item = new Item().fromDB(rows[0]);

				if (item.supplierId !== new_ro.supplierId){
					dbTransactions.rollbackTransaction();
					return Response[422]("Supplier "+new_ro.supplierId+" doesn't sell a product with item id: "+ p.itemId);
				}

				if (item.skuId !== p.skuId){
					dbTransactions.rollbackTransaction();
					return Response[422]("Item id "+p.itemId+" doesn't correspond to SKUId "+p.skuId);
				}

				await new RestockOrderDAO().addItemToARestockOrder(p.itemId, roid, p.quantity, new_ro.supplierId);
			}

			/* ADDING SKU */
			/*for (let p of new_ro.products) {
				let item = await new SkuDAO().getSKUByIDFromDB(p.skuId);
				if (item.length == 0)
					throw new Error("Item not found");
				await new RestockOrderDAO().addItemToARestockOrder(p.skuId, roid, p.quantity);
			}*/

			dbTransactions.commitTransaction();
			return Response[201]();
		} catch (e) {
			console.log(e);
			dbTransactions.rollbackTransaction();
			return Response[503](e);
		}

	}


	async modifyState(id, reqBody) {
		try {
			RestockOrder.checkId(id);
			RestockOrder.checkNewState(reqBody.newState);
		} catch (e) {
			return Response[422](e);
		}

		try {
			const row = await new RestockOrderDAO().getRestockOrderByIdFromDB(id);
			if (row.length == 0)
				return Response[404]("No restock order associated to id");
		} catch (e) {
			return Response[503](e);
		}

		try {
			await new RestockOrderDAO().modifyStateIntoDb(id, reqBody.newState);
			return Response[200]();
		} catch (e) {
			return Response[503](e);
		}
	}

	async addSkuItemsToRestockOrder(id, reqBody) {
		let skuIt;

		try {
			try {
				RestockOrder.checkId(id);
				skuIt = new RestockOrder().skuItemsFromAPI(reqBody.skuItems);
			} catch (e) {
				return Response[422](e);
			}

			const row = await new RestockOrderDAO().getRestockOrderByIdFromDB(id);
			if (row.length == 0)
				return Response[404]("No restock order associated to id");

			if (row[0].state != "DELIVERED")
				return Response[422]("Order is not in DELIVERED status");

		} catch (e) {
			return Response[503](e);
		}

		try {
			await dbTransactions.beginTransaction();
		} catch (e) {
			return Response[503](e);
		}

		try {
			for (let i = 0; i < skuIt.length; i++) {
				await new RestockOrderDAO().addSkuItemToRestockOrderIntoDB(skuIt[i].skuId, skuIt[i].rfid, id);
			}

			await dbTransactions.commitTransaction();
			return Response[200]();
		} catch (e) {
			dbTransactions.rollbackTransaction();
			return Response[503](e);
		}

	}

	async addTransportNote(id, reqBody) {
		let tn;
		try {
			RestockOrder.checkId(id);
			tn = new TransportNote().transportNoteFromAPI(reqBody.transportNote);
		} catch (e) {
			return Response[422](e);
		}

		try {
			const row = await new RestockOrderDAO().getRestockOrderByIdFromDB(id);
			if (row.length == 0)
				return Response[404]("No restock order associated to id");
			let ro = new RestockOrder().fromDB(row[0]);
			if (ro.state !== "DELIVERY")
				return Response[422]("State is not DELIVERY");
			dbTransactions.beginTransaction();
		} catch (e) {
			return Response[503](e);
		}

		try {
			const last_id = await new RestockOrderDAO().addTransportNoteIntoDb(tn);
			await new RestockOrderDAO().addTransportNoteToROIntoDb(id, last_id);

			dbTransactions.commitTransaction();
			return Response[200]();
		} catch (e) {
			dbTransactions.rollbackTransaction();
			return Response[503](e);
		}
	}

	async deleteRestockOrderById(id) {
		try {
			RestockOrder.checkId(id);
		} catch (e) {
			return Response[422](e);
		}

		try {
			await new RestockOrderDAO().deleteRestockOrderByIdIntoDB(id);
			return Response[204]();
		} catch (e) {
			return Response[503](e);
		}
	}

}

module.exports = RestockOrderServices;
