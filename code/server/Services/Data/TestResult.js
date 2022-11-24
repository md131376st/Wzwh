const Validation = require("../../Modules/Validation");
const SkuItem = require("./SkuItem");
const TestDescriptor = require("./TestDescriptor");

class TestResult {
  id;
  rfid;
  date;
  result;
  testDescriptor;

  constructor() {}

  fromDB(rawTestResult) {
    this.id = rawTestResult.id;
    this.date = rawTestResult.date;
    this.testDescriptor = rawTestResult.testDescriptor;
    this.result = rawTestResult.result === 1;
    this.rfid = rawTestResult.skuitem;

    return this;
  }

  FromAPICreate(rawTestResult) {
    if(!Validation.dateIsValid(rawTestResult.Date))
      throw new Error("Date format not valid")

    if (Validation.isNotBoolean(rawTestResult.Result)) {
        throw new Error("Test Result result value is not correct");
    }

    SkuItem.checkId(rawTestResult.rfid);
    TestDescriptor.checkId(rawTestResult.idTestDescriptor);

    this.rfid = rawTestResult.rfid;
    this.date = rawTestResult.Date;
    this.result = rawTestResult.Result;
    this.testDescriptor = rawTestResult.idTestDescriptor;

    return this;
  }

  FromAPIModify(rawTestResult) {
    if(!Validation.dateIsValid(rawTestResult.newDate))
      throw new Error("Date format not valid")

    if (Validation.isNotBoolean(rawTestResult.newResult)) {
        throw new Error("Test Result result value is not correct");
    }

    TestDescriptor.checkId(rawTestResult.newIdTestDescriptor);

    this.date = rawTestResult.newDate;
    this.result = rawTestResult.newResult;
    this.testDescriptor = rawTestResult.newIdTestDescriptor;

    return this;
  }

  static checkId(id) {
    if (Validation.isNotNumericID(id)) {
      throw new Error("Test Result id has to be a defined number");
    }
  }

  static validRfid(rfid) {
    if (rfid.length !== 32) {
      throw new Error("RFID has to be a 32 character string");
    }
  }



  toDBFormat() {
    return {
      date: this.date,
      testDescriptor: this.testDescriptor,
      result: this.result,
      skuitem: this.rfid
    };
  }

  intoAPIFormat() {
    return {
      id: this.id,
      idTestDescriptor: this.testDescriptor,
      Date: this.date,
      Result: this.result,
    };
  }
}

module.exports = TestResult;
