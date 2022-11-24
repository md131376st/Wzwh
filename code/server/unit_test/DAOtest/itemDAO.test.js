const ItemDAO = require("../../DAO/ItemDAO");
const UserDAO = require("../../DAO/UserDAO");
const SkuDAO = require("../../DAO/SkuDAO");
const TestUtility = require("../../Modules/testUtility");

describe('testItemDao', () => {
	beforeAll(async () => {
		await new TestUtility().deleteData('item')
		await new TestUtility().deleteData('user')
		await new TestUtility().deleteData('sku')

	});

	afterAll(async () => {
		await new TestUtility().deleteData('item')
		await new TestUtility().deleteData('user')
		await new TestUtility().deleteData('sku')
	});


	testNewItem();
	test('delete item from db', async () => {
		await new TestUtility().deleteData('item')
		let res = await new ItemDAO().getAllItemsFromDB();
		expect(res.length).toStrictEqual(0);
	});
});

function testNewItem() {
	test('create new item', async () => {
		const user_id = await new UserDAO().createNewUserIntoDb({
			name: "a",
			surname: "b",
			email: "c@mail.com",
			type: "d"
		}, "12345678");
		const sku_id = await new SkuDAO().createNewSkuIntoDB({
			description: "a",
			weight: 10,
			volume: 30,
			prices: 5,
			notes: "e",
			availableQuantity: 15,
		});

		const item = {"description": 'test', "price": 10, "sku": sku_id, "supplier": user_id}
		await new ItemDAO().createItemIntoDB(item)
		let res = await new ItemDAO().getAllItemsFromDB();
		expect(res.length).toStrictEqual(1);

		res = await new ItemDAO().getItemByIdFromDB(res[0].id);

		expect(res[0].description).toStrictEqual(item.description);
		expect(res[0].price).toStrictEqual(item.price);
		expect(res[0].sku).toStrictEqual(item.sku);
		expect(res[0].supplier).toStrictEqual(item.supplier);
	});
}
