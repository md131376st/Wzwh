const ProductWithSkuItem = require("./ProductWithSkuItem");
const ProductWithSkuAndQuantity = require("./ProductWithSkuAndQuantity");
const User = require("./User");
const Validation = require("../../Modules/Validation");

class InternalOrder {
  id;
  issueDate;
  state;
  customerId;
  products;

  FromDB(internalOrder) {
    this.id = internalOrder.id;
    this.issueDate = internalOrder.date;
    this.state = internalOrder.state;
    this.customerId = internalOrder.fromCustomer;
    return this;
  }

  assignProductsFromDB(skuRows, skuItemRows) {
    this.products = [];
    if (this.state === "COMPLETED") {
      this.products = skuItemRows.map((r) => {
        let rawSku = skuRows.find((s) => s.SKUId === r.SKUId);
        return new ProductWithSkuItem().fromDB(rawSku, r.rfid);
      });
    } else {
      this.products = skuRows.map((r) =>
        new ProductWithSkuAndQuantity().fromDB(r)
      );
    }
  }

  toDBFormat() {
    return {
      date: this.issueDate,
      state: this.state,
      fromCustomer: this.customerId,
    };
  }



  FromAPI(rawInternalOrder) {
    if (!Validation.dateIsValid(rawInternalOrder.issueDate))
      throw new Error("Date format not valid")

    User.checkId(rawInternalOrder.customerId);

    if (!Array.isArray(rawInternalOrder.products) || rawInternalOrder.products.length === 0)
      throw new Error("products has to be an array longerthan 0");


    let products = rawInternalOrder.products.map((p) => new ProductWithSkuAndQuantity().fromAPI(p));

    this.issueDate = rawInternalOrder.issueDate;
    this.customerId = rawInternalOrder.customerId;
    this.products = products;

    return this;
  }

  intoAPIFormat() {
    return {
      id: this.id,
      issueDate: this.issueDate,
      state: this.state,
      products: this.products.map((p) => p.intoAPIFormat()),
      customerId: this.customerId,
    };
  }


  setNewState(newState) {
    /*
    if (typeof newState !== "string")
      throw new Error("State has to be a defined string");
    if (
      this.state === "ISSUED" &&
      newState !== "ACCEPTED" &&
      newState !== "REFUSED" &&
      newState !== "CANCELED"
    )
      throw new Error("If the old state is ISSUED the new one has to be one in ACCEPTED, REFUSED or CANCELED");
    if (this.state === "ACCEPTED" && newState !== "COMPLETED")
      throw new Error("If the old state is ACCEPTED the new one has to be COMPLETED");
    if (this.state === undefined && newState !== "ISSUED")
      throw new Error("If the old state is undefined the new one has to be ISSUED");
    if (this.state === "COMPLETED")
      throw new Error("If the order is in the COMPLETE state it can not change state anymore");
    */
    InternalOrder.checkNewState(newState);
    this.state = newState;
  }

  static checkNewState(newState) {
    if (Validation.emptyString(newState) || (
      newState !== 'ISSUED' && newState !== 'ACCEPTED' && newState !== 'CANCELED'
      && newState !== 'REFUSED' && newState !== 'COMPLETED'))
      throw new Error('NewState not valid');
  }

  /*completed(rawSkuItems) {
    let newProductList = [];
    let rfidList;
    for (let product of this.products) {
      rfidList = rawSkuItems.filter((r) => r.SkuID === product.skuId).map(r => r.RFID);
      newProductList.push(...product.internalOrderCompleted(rfidList));
    }
    this.products = newProductList;
  }*/

  fromAPIPModify(rawInternalOrder) {
    this.setNewState(rawInternalOrder.newState);

    if (this.state === "COMPLETED") {
      if (!Array.isArray(rawInternalOrder.products) || rawInternalOrder.products.length === 0)
        throw new Error("Products has to be a not empty array");

      this.products = rawInternalOrder.products.map((p) => new ProductWithSkuItem().fromAPIPModify(p))
    }

    return this;
  }

  static checkId(id) {
    if (Validation.isNotNumericID(id)) {
      throw new Error("Internal order id has to be a defined number");
    }
  }

}

module.exports = InternalOrder;
