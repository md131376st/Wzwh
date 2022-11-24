const TestResultDAO = require("../../DAO/TestResultDAO");
const TestUtility = require("../../Modules/testUtility");
const SkuDAO = require("../../DAO/SkuDAO");
const SkuItemDAO = require("../../DAO/SkuItemDAO");
const TestDescriptorDAO = require("../../DAO/TestDescriptorDAO");

describe("testTestResultDao", () => {
  beforeAll(async () => {
    await new TestUtility().deleteData("testDescriptor");
    await new TestUtility().deleteData("testResult");
    await new TestUtility().deleteData('sku')
    await new TestUtility().deleteData('skuItem')
  });

  afterAll(async () => {
    await new TestUtility().deleteData("testDescriptor");
    await new TestUtility().deleteData("testResult");
    await new TestUtility().deleteData('sku')
    await new TestUtility().deleteData('skuItem')
  });

  testModifyTestResult();

  test("delete testResult from db", async () => {
    await new TestUtility().deleteData("testResult");
    var res = await new TestResultDAO().getAllTestResultForASkuItemFromDB();
    expect(res.length).toStrictEqual(0);
  });
});

function testModifyTestResult() {
  test("modify a test result", async () => {
    try {
      const sku_id = await new SkuDAO().createNewSkuIntoDB({
        description: "a",
        weight: 100,
        volume: 200,
        prices: 6,
        notes: "e",
        availableQuantity: 1,
      });

      const testDescriptorId = await new TestDescriptorDAO().createTestDescriptorIntoDB({
        name: "AAA",
        sku: sku_id,
        procedureDescription: "BBB",
        sku: sku_id,
      }).lastID;

      await new SkuItemDAO().createSKUItemIntoDB({
        "sku": sku_id,
        "rfid": "12345678901234567890123456789016",
        available: 1,
        dateOfStock: "2021/11/28 09:33"
      });

      const testResult = {
        skuitem: "12345678901234567890123456789016",
        testDescriptor: testDescriptorId,
        date: "2021/11/28 09:33",
        result: 1,
      };

      const modifytestResult = {
        testDescriptor: testDescriptorId,
        date: "2022/05/20 09:33",
        result: 0,
      };
      
      const tr = await new TestResultDAO().createTestResultIntoDB(testResult);
      
      await new TestResultDAO().modifyTestResultForASkuItemByIdIntoDB(testResult.skuitem, tr.lastID, modifytestResult);

      var res = await new TestResultDAO().getAllTestResultForASkuItemFromDB(testResult.skuitem);
      expect(res.length).toStrictEqual(1);
      expect(res[0].result).toStrictEqual(modifytestResult.result);

    } catch (e) {
      console.log(e);
    }
  });
}
