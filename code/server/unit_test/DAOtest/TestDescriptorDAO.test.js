const TestResultDAO = require("../../DAO/TestResultDAO");
const TestUtility = require("../../Modules/testUtility");
const SkuDAO = require("../../DAO/SkuDAO");
const SkuItemDAO = require("../../DAO/SkuItemDAO");
const TestDescriptorDAO = require("../../DAO/TestDescriptorDAO");

describe("testTestDercriptorDao", () => {
  beforeAll(async () => {
    await new TestUtility().deleteData("testDescriptor");
    await new TestUtility().deleteData('sku');
  });

  afterAll(async () => {
    await new TestUtility().deleteData("testDescriptor");
    await new TestUtility().deleteData('sku');
  });

  testCreateTestDescriptor();

  testGetAllTestDescriptors();

  testGetOneTestDescriptor();

  testDeleteTestDescriptorById();

  test("delete all testDescriptor from db", async () => {
    await new TestUtility().deleteData("testDescriptor");
    var res = await new TestDescriptorDAO().getAllTestDescriptorFromDB();
    expect(res.length).toStrictEqual(0);
  });
});

function testCreateTestDescriptor() {
  test("create a test result", async () => {

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
          procedureDescription: "BBB"
        }).lastID;



      let res = await new TestDescriptorDAO().getAllTestDescriptorFromDB();
      expect(res.length).toStrictEqual(1);

    } catch (e) {
      console.log(1, e);
    }
  });
}

function testGetAllTestDescriptors() {
    test("get all test descriptors", async () => {
      try {


        await new TestUtility().deleteData("testDescriptor");
        await new TestUtility().deleteData('sku');
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
            procedureDescription: "BBB"
          });

        let res = await new TestDescriptorDAO().getAllTestDescriptorFromDB();
        expect(res.length).toStrictEqual(1);
        expect(res[0].name).toStrictEqual("AAA");
        expect(res[0].sku).toStrictEqual(sku_id);
        expect(res[0].procedureDescription).toStrictEqual("BBB");

      } catch (e) {
        console.log(2, e);
      }
    });
  }

  function testGetOneTestDescriptor() {
    test("get a test descriptor by id", async () => {
      try {

        let all = await new TestDescriptorDAO().getAllTestDescriptorFromDB();
        expect(all.length).toStrictEqual(1);
        let res = await new TestDescriptorDAO().getTestDescriptorByIdFromDB(all[0].id);
        expect(res.length).toStrictEqual(1);

      } catch (e) {
        console.log(3, e);
      }
    });
  }

  function testDeleteTestDescriptorById() {
    test("delete a test descriptor by id", async () => {
      try {
        let all = await new TestDescriptorDAO().getAllTestDescriptorFromDB();
        expect(all.length).toStrictEqual(1);
        await new TestDescriptorDAO().deleteTestDescriptorByIdIntoDB(all[0].id);
        all = await new TestDescriptorDAO().getAllTestDescriptorFromDB();
        expect(all.length).toStrictEqual(0);
      } catch (e) {
        console.log(4, e);
      }
    });
  }
