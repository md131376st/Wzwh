const ProductWithSkuItem = require("./ProductWithSkuItem");
const RestockOrder = require("./RestockOrder");
const Item = require("../Data/Item");
const Validation = require("../../Modules/Validation");

class ReturnOrder {

	id;
	returnDate;
	restockOrderId;
	products;

	constructor() { }

	fromDB(rawReturnOrder) {
		this.id = rawReturnOrder.id;
		this.returnDate = rawReturnOrder.returnDate;
		this.restockOrderId = rawReturnOrder.restockOrder;
		return this;
	}

	assignProductsFromDB(rawProducts) {
		this.products = rawProducts.map(r => new ProductWithSkuItem().fromDB(r, r.rfid))
	}

	fromAPI(rawReturnOrder) {
		RestockOrder.checkId(rawReturnOrder.restockOrderId);

		if (!Validation.dateIsValid(rawReturnOrder.returnDate))
			throw new Error("Return date not valid");

		if (!Array.isArray(rawReturnOrder.products) || rawReturnOrder.products.length === 0)
			throw new Error("Products has to be an array longerthan 0");

		this.returnDate = rawReturnOrder.returnDate;
		this.restockOrderId = rawReturnOrder.restockOrderId;
		this.products = rawReturnOrder.products.map(p => {
			const product = new ProductWithSkuItem().fromAPI(p);
			Item.checkId(p.itemId); 
			product.itemId = p.itemId;
			return product;
		}
		);
		return this;
	}


	intoAPIFormat() {
		return {
			returnDate: this.returnDate,
			products: this.products.map(p => {
				const product = p.intoAPIFormat()
				product.itemId = p.itemId;
				return product;
			}
				),
			restockOrderId: this.restockOrderId
		}
	}

	intoAPIFormatWithID() {
		return {
			id: this.id,
			...this.intoAPIFormat()
		}
	}

	intoDBFormat() {
		return {
			returnDate: this.returnDate,
			restockOrder: this.restockOrderId
		}

	}

	static checkId(id) {
		if (Validation.isNotNumericID(id)) {
			throw new Error("Return Order " + id + " has to be a defined number");
		}
	}
}

module.exports = ReturnOrder;
