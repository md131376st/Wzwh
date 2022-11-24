const Sku = require("./Sku");
const Validation = require("../../Modules/Validation")

class ProductWithSkuAndQuantity {
  skuId;
  quantity;
  price;
  description;

  constructor() {}

  fromDB(rawSku) {
    this.skuId = rawSku.sku;
    this.quantity = rawSku.quantity;
    this.price = rawSku.prices;
    this.description = rawSku.description;

    return this;
  }

  fromAPI(rawProduct) {
    if (typeof rawProduct !== 'object')
      throw new Error("A product cannot be undefined");

    Sku.checkId(rawProduct.SKUId);

    if (Validation.emptyString(rawProduct.description))
      throw new Error("Description "+rawProduct.description+" not valid");

    if (Validation.isNotPrice(rawProduct.price))
      throw new Error("Price "+rawProduct.price+" not valid");

    if (Validation.negativeOrZeroNumber(rawProduct.qty))
      throw new Error("Quantity "+rawProduct.qty+" not valid");
    
    
    this.skuId = rawProduct.SKUId;
    this.quantity = rawProduct.qty;
    this.description = rawProduct.description;
    this.price = rawProduct.price;

    return this;
  }

  intoAPIFormat() {
    return {
      SKUId: this.skuId,
      price: this.price,
      description: this.description,
      qty: this.quantity,
    };
  }

  /*internalOrderCompleted(rfidList) {
    if (rfidList.length !== this.quantity)
      throw new Error(
        "Order sku quantity does not match with the number ok skuItems passed for that sku"
      );
    let completedOrderProductList = [];
    for (let rfid of rfidList) {
      completedOrderProductList.push(
        new ProductWithSkuItem().fromNotCompletedOrderproduct(this, rfid)
      );
    }
    return completedOrderProductList;
  }*/
}

module.exports = ProductWithSkuAndQuantity;
