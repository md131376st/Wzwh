const SkuItem = require("./SkuItem");
const Sku = require("./Sku");
const Validation = require("../../Modules/Validation");

class ProductWithSkuItem {
  skuId;
  rfid;
  price;
  description;

  constructor() { }

  fromDB(rawSku, rfid) {
    this.skuId = rawSku.sku;
    this.price = rawSku.prices;
    this.rfid = rfid;
    this.description = rawSku.description;
    this.itemId = rawSku.itemId;
    return this;
  }

  fromAPI(rawProduct) {
    if (typeof rawProduct !== 'object')
      throw new Error("A product cannot be undefined");

    Sku.checkId(rawProduct.SKUId);
    SkuItem.checkId(rawProduct.RFID);

    if (Validation.isNotPrice(rawProduct.price))
      throw new Error("Product price format not valid");

    if (Validation.emptyString(rawProduct.description))
      throw new Error("Description " + rawProduct.description + " not valid");


    this.skuId = rawProduct.SKUId;
    this.rfid = rawProduct.RFID;
    this.price = rawProduct.price;
    this.description = rawProduct.description;

    return this;
  }

  intoAPIFormat() {
    return {
      SKUId: this.skuId,
      RFID: this.rfid,
      price: this.price,
      description: this.description,
    };
  }

  /*fromNotCompletedOrderproduct(notCompletedOrderProduct, rfid) {
    this.skuId = notCompletedOrderProduct.skuId;
    this.rfid = rfid;
    this.price = notCompletedOrderProduct.price;
    this.description = notCompletedOrderProduct.description;

    return this;
  }*/

  fromAPIPModify(product) {
    if (typeof product !== 'object')
      throw new Error("A product has to be a defined object");

    Sku.checkId(product.SkuID);
    SkuItem.checkId(product.RFID);

    this.skuId = product.SkuID;
    this.rfid = product.RFID;
    
    return this
  }
}

module.exports = ProductWithSkuItem;
