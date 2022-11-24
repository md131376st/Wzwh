const TestResultDAO = require("../DAO/TestResultDAO");
const TestDescriptorDAO = require("../DAO/TestDescriptorDAO");
const TestResult = require("./Data/TestResult");
const SkuItemDAO = require("../DAO/SkuItemDAO");
const SkuItem = require("./Data/SkuItem");
const Response = require("../Modules/responses");

class TestResultServices {
  async getAllTestResultForASkuItem(rfid) {
    try {
      SkuItem.checkId(rfid);
    } catch (e) {
      return Response[422](e);
    }

    try {
      const skuItem = await new SkuItemDAO().getSKUItemByRFIDFromDB(rfid);
      if (skuItem.length === 0) {
        return Response[404]("No SKUItem associated with rfid: " + rfid);
      }
    } catch (e) {
      return Response[500](e);
    }

    try {
      let rows = await new TestResultDAO().getAllTestResultForASkuItemFromDB(
        rfid
      );
      let testResults = rows.map((r) => new TestResult().fromDB(r).intoAPIFormat());
      return Response[200](testResults);
    } catch (e) {
      return Response[500](e);
    }
  }

  async getTestResultForASkuItemById(testResultId, rfid) {
    try {
      SkuItem.checkId(rfid);
      TestResult.checkId(testResultId);
    } catch (e) {
      return Response[422](e);
    }

    try {
      const skuItem = await new SkuItemDAO().getSKUItemByRFIDFromDB(rfid);
      if (skuItem.length === 0) {
        return Response[404]("No SKUItem associated to rfid: " + rfid);
      }

      const testResultRows = await new TestResultDAO().getTestResultForASkuItemByIdFromDB(
        testResultId,
        rfid
      );

      if (testResultRows.length === 0)
        return Response[404]("No test result associated to id:" + testResultId);

      let testResult = new TestResult().fromDB(testResultRows[0]);

      return Response[200](testResult.intoAPIFormat());
    } catch (e) {
      return Response[500](e);
    }
  }

  async createTestResult(rawTestResult) {
    let testResult;
    try {
      testResult = new TestResult().FromAPICreate(rawTestResult);
    } catch (e) {
      return Response[422](e);
    }

    try {
      const skuItem = await new SkuItemDAO().getSKUItemByRFIDFromDB(testResult.rfid);
      if (skuItem.length === 0) {
        return Response[404]("No SKUItem associated with rfid: " + testResult.rfid);
      }

      const testDescriptor = await new TestDescriptorDAO().getTestDescriptorByIdFromDB(testResult.testDescriptor);
      if (testDescriptor.length === 0) {
        return Response[404]("No test descriptor associated with id: " + testResult.testDescriptor);
      }

      await new TestResultDAO().createTestResultIntoDB(testResult.toDBFormat());
      return Response[201]();
    } catch (e) {
      return Response[503](e);
    }
  }

  async modifyTestResultForASkuItemById(rfid, testResultId, rawTestResult) {
    let testResult;
    try {
      TestResult.checkId(testResultId);
      SkuItem.checkId(rfid);
      testResult = new TestResult().FromAPIModify(rawTestResult);
    } catch (e) {
      return Response[422](e);
    }
    
    try {
      const skuItem = await new SkuItemDAO().getSKUItemByRFIDFromDB(rfid);
      if (skuItem.length === 0) {
        return Response[404]("No SKUItem associated with rfid: " + rfid);
      }

      const testDescriptor = await new TestDescriptorDAO().getTestDescriptorByIdFromDB(testResult.testDescriptor);
      if (testDescriptor.length === 0) {
        return Response[404]("No test descriptor associated with id: " + testResult.testDescriptor);
      }

      const testResultRows = await new TestResultDAO().getTestResultForASkuItemByIdFromDB(
        testResultId,
        rfid
      );
      if (testResultRows.length === 0)
        return Response[404]("No test result associated to id:" + testResultId);

      await new TestResultDAO().modifyTestResultForASkuItemByIdIntoDB(
        rfid,
        testResultId,
        testResult.toDBFormat()
      );

      return Response[200]();
    
    } catch (e) {
      return Response[503](e);
    }
  }

  async deleteTestResultById(rfid, testResultId) {
    try {
      TestResult.checkId(testResultId);
      SkuItem.checkId(rfid);
    } catch (e) {
      return Response[422](e);
    }
    
    try {
      await new TestResultDAO().deleteTestResultByIdIntoDB(rfid, testResultId);
      return Response[204]();
    } catch (e) {
      return Response[503](e);
    }
  }
}

module.exports = TestResultServices;
