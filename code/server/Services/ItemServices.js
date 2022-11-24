const ItemDAO = require("../DAO/ItemDAO");
const Item = require("./Data/Item");
const SkuDAO = require("../DAO/SkuDAO");
const Response = require("../Modules/responses");
const User = require("./Data/User");

class ItemServices {
	async getAllItems() {
		try {
			const rows = await new ItemDAO().getAllItemsFromDB();
			const itemList = rows.map((r) => new Item().fromDB(r));

			return Response[200](itemList.map((i) => i.intoAPIFormat()));
		} catch (e) {
			return Response[500](e);
		}
	}

	async getItemById(ID, supplierId) {
		try {
			Item.checkId(ID);
			User.checkId(supplierId);
		} catch (e) {
			return Response[422](e);
		}

		try {
			const rows = await new ItemDAO().getItemByIdFromDB(ID, supplierId);
			if (rows.length === 0)
				return Response[404]("No item associated with the id");

			const item = new Item().fromDB(rows[0]);
			return Response[200](item.intoAPIFormat());

		} catch (e) {
			return Response[500](e);
		}

	}

	async createItem(APIBody) {
		let newItem;
		try {
			newItem = new Item().fromAPI(APIBody);
		} catch (e) {
			return Response[422](e);
		}

		try {
			const skuRows = await new SkuDAO().getSKUByIDFromDB(newItem.skuId);
			if (skuRows.length === 0)
				return Response[404](
					"No sku with id: " + newItem.skuId
				);

			const skuItemRows = await new ItemDAO().getItemByIdFromDB(newItem.id, newItem.supplierId);
			if (skuItemRows.length !== 0)
				return Response[422](
					"Already exists an item with id: " + newItem.id
				);
			const supplierSellSku = await new ItemDAO().supplierSellSku(
				newItem.supplierId,
				newItem.skuId
			);
			if (supplierSellSku)
				return Response[422](
					"Supplier with id: " +
					newItem.supplierId +
					" already sell sku with id: " +
					newItem.skuId
				);
			await new ItemDAO().createItemIntoDB(newItem.intoDBFormat());
			return Response[201]();
		} catch (e) {
			return Response[503](e);
		}
	}

	async modifyItem(ID, APIBody, supplierId) {
		let newItem;
		try {
			Item.checkId(ID);
			User.checkId(supplierId);
			newItem = new Item().fromAPIModify(APIBody);

			const rows = await new ItemDAO().getItemByIdFromDB(ID, supplierId);
			if (rows.length === 0)
				return Response[404]("No item associated with the id");
		} catch (e) {
			return Response[422](e)
		}
		try {
			await new ItemDAO().modifyItemIntoDB(ID, newItem.intoDBFormat(), supplierId);
			return Response[200]();
		} catch (e) {
			return Response[503](e);
		}
	}

	async deleteItemById(ID, supplierId) {
		try {
			Item.checkId(ID);
			User.checkId(supplierId);
		} catch (e) {
			return Response[422](e);
		}

		try {
			await new ItemDAO().deleteItemByIdFromDB(ID, supplierId);
			return Response[204]();
		} catch (e) {
			return Response[503](e);
		}
	}
}

module.exports = ItemServices;
