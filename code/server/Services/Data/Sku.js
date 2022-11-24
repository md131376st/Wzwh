const Validation = require("../../Modules/Validation");

class Sku {
  id;
  description;
  volume;
  weight;
  notes;
  position;
  availableQuantity;
  price;
  testDescriptor;

  constructor() {}

  fromAPI(obj) {
    if (Validation.emptyString(obj.description))
      throw new Error("Description not valid");

    if (Validation.negativeOrZeroNumber(obj.weight)) throw new Error("Weight not valid");

    if (Validation.negativeOrZeroNumber(obj.volume)) throw new Error("Volume not valid");

    if (Validation.emptyString(obj.notes)) throw new Error("Notes not valid");

    if (Validation.isNotPrice(obj.price)) throw new Error("Price not valid");

    this.description = obj.description;
    this.volume = obj.volume;
    this.weight = obj.weight;
    this.notes = obj.notes;
    this.price = obj.price;
    this.setAvailableQuantity(obj.availableQuantity);

    return this;
  }

  fromDB(obj) {
    this.id = obj.id;
    this.description = obj.description;
    this.volume = obj.volume;
    this.weight = obj.weight;
    this.notes = obj.notes;
    this.position = obj.position;
    this.availableQuantity = obj.availableQuantity;
    this.price = obj.prices;
    this.testDescriptor = obj.testDescriptor;

    return this;
  }

  fromAPIModify(obj) {
    let new_s = {
      description: obj.newDescription,
      weight: obj.newWeight,
      volume: obj.newVolume,
      notes: obj.newNotes,
      availableQuantity: obj.newAvailableQuantity,
      price: obj.newPrice,
    };

    return this.fromAPI(new_s);
  }

  intoDBFormat() {
    return {
      description: this.description,
      volume: this.volume,
      weight: this.weight,
      notes: this.notes,
      availableQuantity: this.availableQuantity,
      prices: this.price,
    };
  }

  intoAPIFormat(withId) {
    let res = {
      description: this.description,
      volume: this.volume,
      weight: this.weight,
      notes: this.notes,
      position: this.position,
      availableQuantity: this.availableQuantity,
      price: this.price,
      testDescriptors: this.testDescriptor ? [this.testDescriptor] : [],
    };

    if (withId)
      res.id = this.id;

    return res;
  }

  setAvailableQuantity(newQuantity) {
    if (Validation.negativeNumber(newQuantity) || !Number.isInteger(newQuantity))
      throw new Error("Quantity has to be a defined, positive, integer");
    this.availableQuantity = newQuantity;
  }

  
  static checkId(id) {
    if (Validation.isNotNumericID(id) ) {
      throw new Error("SKU id "+id+" has to be a defined positive number");
    }
  }
}

module.exports = Sku;
