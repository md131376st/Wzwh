const Sku = require("./Sku");
const User = require("./User");
const Validation = require("../../Modules/Validation");

class Item {

	id;
	description;
	price;
	skuId;
	supplierId;

	constructor() {
	}

	fromDB(obj) {
		this.id = obj.id;
		this.description = obj.description;
		this.price = obj.price;
		this.skuId = obj.sku;
		this.supplierId = obj.supplier;
		return this;
	}

	fromAPI(obj) {
		Item.checkId(obj.id)

		if (Validation.emptyString(obj.description))
			throw new Error("Description format not valid");

		if (Validation.isNotPrice(obj.price))
			throw new Error("Price format not valid");

		Sku.checkId(obj.SKUId);
		User.checkId(obj.supplierId);
		
		this.id = obj.id;
		this.description = obj.description;
		this.price = obj.price;
		this.skuId = obj.SKUId;
		this.supplierId = obj.supplierId;
		return this;


	}

	fromAPIModify(obj) {
		if (Validation.emptyString(obj.newDescription))
			throw new Error("Description format not valid");

		if (Validation.isNotPrice(obj.newPrice))
			throw new Error("Price format not valid");

		this.description = obj.newDescription;
		this.price = obj.newPrice;
		return this;
	}

	intoAPIFormat() {
		return {
			id: this.id,
			description: this.description,
			price: this.price,
			SKUId: this.skuId,
			supplierId: this.supplierId
		}

	}

	intoDBFormat() {
		return {
			id: this.id,
			description: this.description,
			price: this.price,
			sku: this.skuId,
			supplier: this.supplierId
		}
	}

	itemForRestockOrder(item, quantity) {
		return { "SKUId": item.sku, "itemId": item.id, "description": item.description, "price": item.price, "qty": quantity }
	}

	itemForReturnOrder(item) {
		return { "sku": item.sku, "description": item.description, "price": item.price }
	}

	static checkId(id) {
		if (Validation.isNotNumericID(id)) {
			throw new Error("Item id " + id + " not valid");
		}
	}
}

module.exports = Item;
