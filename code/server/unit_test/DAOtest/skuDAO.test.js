const SkuDAO = require("../../DAO/SkuDAO");
const TestUtility = require("../../Modules/testUtility");

describe("testSkuDao", () => {
  beforeAll(async () => {
    await new TestUtility().deleteData("sku");
    await new TestUtility().deleteData("position");
  });

  afterAll(async () => {
    await new TestUtility().deleteData("sku");
    await new TestUtility().deleteData("position");
  });

  testNewSku();

  test("delete Sku from db", async () => {
    await new TestUtility().deleteData("sku");
    const res2 = await new SkuDAO().getAllSkuFromDB();
    expect(res2.length).toStrictEqual(0);
  });
});

function testNewSku() {
  test("create new sku", async () => {
    const sku = {
      description: "first sku",
      weight: 100,
      volume: 100,
      prices: 10.99,
      notes: "a note",
      availableQuantity: 10,
    };

    try {
      await new SkuDAO().createNewSkuIntoDB(sku);
    } catch (e) {
      console.log("error");
    }

    const res1 = await new SkuDAO().getAllSkuFromDB();
    expect(res1.length).toStrictEqual(1);

    let res2 = await new SkuDAO().getSKUByIDFromDB(res1[0].id);

    expect(res2[0].description).toStrictEqual(sku.description);
    expect(res2[0].weight).toStrictEqual(sku.weight);
    expect(res2[0].volume).toStrictEqual(sku.volume);
    expect(res2[0].prices).toStrictEqual(sku.prices);
    expect(res2[0].notes).toStrictEqual(sku.notes);
    expect(res2[0].availableQuantity).toStrictEqual(sku.availableQuantity);
  });
}
