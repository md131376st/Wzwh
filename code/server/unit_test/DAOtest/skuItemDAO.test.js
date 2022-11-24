const SkuItemDAO = require("../../DAO/SkuItemDAO");
const SkuDAO = require("../../DAO/SkuDAO");
const TestUtility = require("../../Modules/testUtility");
const PositionDAO = require("../../DAO/PositionDAO");

describe("testSkuItemDao", () => {
	beforeAll(async () => {
		await new TestUtility().deleteData('internalOrder')
		await new TestUtility().deleteData('sku')

	});

	afterAll(async () => {
		await new TestUtility().deleteData('internalOrder')
		await new TestUtility().deleteData('sku')

	});

	testNewSkuItem();

	test("delete a skuItems by id from db", async () => {
		/*await new TestUtility().deleteData('skuItem')
		const res2 = await new SkuItemDAO().getAllSkuItemFromDB();
		expect(res2.length).toStrictEqual(0);*/
		await new SkuItemDAO().deleteSKUItemByRFIDIntoDB("12345678901234567890123456789014");
		let res =await new SkuItemDAO().getAllSkuItemFromDB();
		expect(res.length).toStrictEqual(0);

	});
});

function testNewSkuItem() {
	test("get a skuItem by RFID", async () => {

		const sku_id = await new SkuDAO().createNewSkuIntoDB({
			description: "first sku",
			weight: 100,
			volume: 100,
			prices: 10.99,
			notes: "a note",
			availableQuantity: 10,
		});

		const skuItem = {
			rfid: "12345678901234567890123456789014",
			available: 0,
			dateOfStock: "2022/05/20 16:53",
			sku: sku_id,
		};

		try {
			await new SkuItemDAO().createSKUItemIntoDB(skuItem);
			await new SkuItemDAO().getSKUItemByRFIDFromDB(skuItem.rfid);
		} catch (e) {
			console.log("error");
		}

		const res = await new SkuItemDAO().getSKUItemByRFIDFromDB(skuItem.rfid);
		expect(res.length).toStrictEqual(1);

		expect(res[0].available).toStrictEqual(skuItem.available);
		expect(res[0].dateOfStock).toStrictEqual(skuItem.dateOfStock);
		expect(res[0].sku).toStrictEqual(skuItem.sku);
	});
}
