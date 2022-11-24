const UserDAO = require("../../DAO/UserDAO");
const TestUtility = require("../../Modules/testUtility");
const RestockOrderDAO = require("../../DAO/RestockOrderDAO");
const SkuDAO = require("../../DAO/SkuDAO");
const SkuItemDAO = require("../../DAO/SkuItemDAO");

async function preperData() {
	const user_id = await new UserDAO().createNewUserIntoDb({
		name: "a",
		surname: "b",
		email: "c@mail.com",
		type: "supplier"
	}, "12345678");

	return [user_id]
}

describe("RestockOrder", () => {
	beforeAll(async () => {
		await new TestUtility().deleteData('user');
		await new TestUtility().deleteData('restockOrder')
		await new TestUtility().deleteData('sku')
		await new TestUtility().deleteData('skuItem')
		this.data = await preperData();
	});
	afterAll(async () => {
		await new TestUtility().deleteData('user');
		await new TestUtility().deleteData('restockOrder')
		await new TestUtility().deleteData('sku')
		await new TestUtility().deleteData('skuItem')
	});
	test('createNewRestockOrderIntoDb', async () => {
		const reStockItem = {
			supplier: this.data[0],
			issueDate: "2021/12/29 09:33",
			products: []
		};
		await new RestockOrderDAO().createNewRestockOrderIntoDb(reStockItem)
		let res = await new RestockOrderDAO().getAllRestockOrderFromDB();
		expect(res.length).toStrictEqual(1);
		expect(res[0].supplier).toStrictEqual(reStockItem.supplier);
		expect(res[0].issueDate).toStrictEqual(reStockItem.issueDate);
	});
	test('addSkuItemToRestockOrderIntoDB', async () => {
		const sku_id = await new SkuDAO().createNewSkuIntoDB({
			description: "a",
			weight: 30,
			volume: 50,
			prices: 1,
			notes: "e",
			availableQuantity: 20,
		});
		const SkuItem = {
			"sku": sku_id,
			"rfid": "12345678901234567890123456789016",
			available: 0,
			dateOfStock: "2021/12/29 09:33"
		};
		await new SkuItemDAO().createSKUItemIntoDB(SkuItem);
		const reStockItem = {
			supplier: this.data[0],
			issueDate: "2021/12/29 09:33",
			products: []
		};
		let id = await new RestockOrderDAO().createNewRestockOrderIntoDb(reStockItem);
		await new RestockOrderDAO().modifyStateIntoDb(id, "DELIVERED");
		await new RestockOrderDAO().addSkuItemToRestockOrderIntoDB(sku_id, SkuItem.rfid, id);
		const res = await new SkuItemDAO().getSKUItemByRFIDFromDB(SkuItem.rfid)
		expect(res.length).toStrictEqual(1);
		expect(res[0].restockOrder).toStrictEqual(id);
	});

	test("get restock order by id", async () => {
		let res = await new RestockOrderDAO().getAllRestockOrderFromDB();
		let ro = await new RestockOrderDAO().getRestockOrderByIdFromDB(res[0].id)
		expect(ro.length).toStrictEqual(1);
	});

	test("add transport note", async () => {
		let res = await new RestockOrderDAO().getAllRestockOrderFromDB();
		let transportNote = { shipmentDate: "2011-01-01" };
		let transportId = await new RestockOrderDAO().addTransportNoteIntoDb(transportNote);
		await new RestockOrderDAO().addTransportNoteToROIntoDb(res[0].id, transportId);
		let ro = await new RestockOrderDAO().getRestockOrderByIdFromDB(res[0].id);
		expect(ro[0].transportNote).toStrictEqual(transportId);
	})

	test("delete restock order from db", async () => {
		let ro = await new RestockOrderDAO().getAllRestockOrderFromDB();
		await new RestockOrderDAO().deleteRestockOrderByIdIntoDB(ro[0].id);
		await new RestockOrderDAO().deleteRestockOrderByIdIntoDB(ro[1].id);
		var res = await new RestockOrderDAO().getAllRestockOrderFromDB();
		expect(res.length).toStrictEqual(0);
	});
})
