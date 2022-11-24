const Sku = require("./Sku");
const Validation = require("../../Modules/Validation");
const Item = require("./Item");

class SkuItem {
  rfid;
  skuId;
  dateOfStock;
  available;

  constructor() {}

  fromAPI(rawSkuItem) {

    SkuItem.checkId(rawSkuItem.RFID);

    if(!Validation.dateIsValidOrNull(rawSkuItem.DateOfStock))
        throw new Error("Date format not valid")

    Sku.checkId(rawSkuItem.SKUId);

    this.rfid = rawSkuItem.RFID;
    this.skuId = rawSkuItem.SKUId;

    this.dateOfStock = rawSkuItem.DateOfStock;
    this.available = 0;

    return this;
  }

  fromDB(rawSkuItem) {
    this.rfid = rawSkuItem.rfid;
    this.available = rawSkuItem.available;
    this.dateOfStock = rawSkuItem.dateOfStock;
    this.skuId = rawSkuItem.sku;
    return this;
  }

  fromAPIModify(rawSkuItem) {
    SkuItem.checkId(rawSkuItem.newRFID);

    this.rfid = rawSkuItem.newRFID;

    if(!Validation.dateIsValidOrNull(rawSkuItem.newDateOfStock))
        throw new Error("Date format not valid")

    this.dateOfStock = rawSkuItem.newDateOfStock;

    if(rawSkuItem.newAvailable !== 0 && rawSkuItem.newAvailable !== 1)
        throw new Error("newAvailable has to be a number between 0 or 1");

    this.available = rawSkuItem.newAvailable;


    return this;
  }

  fromDB(rawSkuItem) {
    this.rfid = rawSkuItem.rfid;
    this.skuId = rawSkuItem.sku;
    this.available = rawSkuItem.available;
    this.dateOfStock = rawSkuItem.dateOfStock;

    return this;
  }

  intoDBFormat(){
    return{
        rfid: this.rfid,
        available: this.available,
        dateOfStock: this.dateOfStock,
        sku: this.skuId
    }
  }

  intoAPIFormat(withAvailable){
    let res = {
        RFID: this.rfid,
        DateOfStock: this.dateOfStock,
        SKUId: this.skuId
    }

    if (withAvailable)
      res.Available = this.available

    return res;
    
  }

  intoAPIFormatWithoutAvailable(){
    return{
        RFID: this.rfid,
        Available: this.available,
        DateOfStock: this.dateOfStock,
        SKUId: this.skuId
    }
    
  }

  skuItemForRestockOrderIntoAPIFormat(skuItem) {
    return { SKUId: skuItem.sku, itemId: skuItem.itemId, rfid: skuItem.rfid };
  }

  newSkuItemForRestockOrder(skuItem) {
    if (typeof skuItem !== 'object')
      throw new Error("Sku Item not valid")

    Sku.checkId(skuItem.SKUId);
    SkuItem.checkId(skuItem.rfid);
    Item.checkId(skuItem.itemId);

    return { skuId: skuItem.SKUId, rfid: skuItem.rfid };
  }


  static checkId(id) {
    if (Validation.isNotDigitStringID(id, 32))
      throw new Error("RFID has to be a 32 digit string");
  }


}

module.exports = SkuItem;
