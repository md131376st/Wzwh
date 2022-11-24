const Validation = require("../../Modules/Validation");
const Sku = require("./Sku");

class TestDescriptor {
  id;
  name;
  procedureDescription;
  skuId;

  constructor() { }

  fromDB(rawTestDescriptor) {
    this.id = rawTestDescriptor.id;
    this.name = rawTestDescriptor.name;
    this.procedureDescription = rawTestDescriptor.procedureDescription;
    this.skuId = rawTestDescriptor.sku;

    return this;
  }

  fromAPI(rawTestDescriptor) {
    if (Validation.emptyString(rawTestDescriptor.name))
      throw new Error("Test descriptor name has to be a defined string");

    if (Validation.emptyString(rawTestDescriptor.procedureDescription))
      throw new Error("Test descriptor procedure description has to be a defined string");
    
    Sku.checkId(rawTestDescriptor.idSKU);

    this.name = rawTestDescriptor.name;
    this.procedureDescription = rawTestDescriptor.procedureDescription;
    this.skuId = rawTestDescriptor.idSKU;

    return this;
  }

  fromAPIModify(obj) {
    let new_t = {
      name: obj.newName,
      procedureDescription: obj.newProcedureDescription,
      idSKU: obj.newIdSKU,
    };

    return this.fromAPI(new_t);
  }

  static checkId(id) {
    if (Validation.isNotNumericID(id)) {
      throw new Error("Test descriptor id has to be a defined number");
    }
  }

  toDBFormat() {
    return {
      name: this.name,
      procedureDescription: this.procedureDescription,
      sku: this.skuId,
    };
  }

  intoAPIFormat() {
    return {
      id: this.id,
      name: this.name,
      procedureDescription: this.procedureDescription,
      idSKU: this.skuId,
    };
  }
}

module.exports = TestDescriptor;
