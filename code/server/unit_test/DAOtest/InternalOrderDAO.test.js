const InternalOrderDAO = require("../../DAO/InternalOrderDAO");
const UserDAO = require("../../DAO/UserDAO");
const ItemDAO = require("../../DAO/ItemDAO");
const SkuDAO = require("../../DAO/SkuDAO");
const SkuItemDAO = require("../../DAO/SkuItemDAO")
const TestUtility = require("../../Modules/testUtility");

async function preperData() {
	const user_id = await new UserDAO().createNewUserIntoDb({
		name: "a",
		surname: "b",
		email: "c@mail.com",
		type: "customer"
	}, "12345678");

	const internalOrder = {
		date: "2021/11/29 09:33",
		state: "ACCEPTED",
		fromCustomer: user_id
	};
	return [user_id, internalOrder]
}


describe("InternalOrderDao", () => {
	beforeAll(async () => {
		await new TestUtility().deleteData('internalOrder')
		await new TestUtility().deleteData('user')
		await new TestUtility().deleteData('sku')
		await new TestUtility().deleteData('skuItem')

		this.data = await preperData();
	});

	afterAll(async () => {
		await new TestUtility().deleteData('internalOrder')
		await new TestUtility().deleteData('user')
		await new TestUtility().deleteData('sku')
		await new TestUtility().deleteData('skuItem')

	});


	test(`createInternalOrder`, async () => {

		await new InternalOrderDAO().createInternalOrder(this.data[1]);
		let res = await new InternalOrderDAO().getInternalOrdersFromDB("ALL");
		expect(res.length).toStrictEqual(1);
		res = await new InternalOrderDAO().getInternalOrdersFromDB("ID", res[0].id);
		expect(res[0].date).toStrictEqual(this.data[1].date);
		expect(res[0].state).toStrictEqual(this.data[1].state);
		expect(res[0].fromCustomer).toStrictEqual(this.data[1].fromCustomer);


	});

	test(`getAccepted`, async () => {

		let res = await new InternalOrderDAO().getInternalOrdersFromDB("ACCEPTED");
		expect(res.length).toStrictEqual(1);
		res = await new InternalOrderDAO().getInternalOrdersFromDB("ID", res[0].id);
		expect(res[0].date).toStrictEqual(this.data[1].date);
		expect(res[0].state).toStrictEqual(this.data[1].state);
		expect(res[0].fromCustomer).toStrictEqual(this.data[1].fromCustomer);


	});

	test(`addSkuItemToInternalOrderIntoDB`, async () => {
		const sku_id = await new SkuDAO().createNewSkuIntoDB({
			description: "a",
			weight: 10,
			volume: 20,
			prices: 5,
			notes: "e",
			availableQuantity: 100,
		});
		const internalOrderId = await new InternalOrderDAO().createInternalOrder(this.data[1]);
		const productInfo = {
			rfid: "12345678901234567890123456780019",
			sku: sku_id,
			id: internalOrderId,
			available: 1
		};
		await new SkuItemDAO().createSKUItemIntoDB(productInfo);
		await new InternalOrderDAO().addSkuItemToInternalOrderIntoDB(
			internalOrderId,
			"12345678901234567890123456780019",
			sku_id
		);
		let res = await new SkuItemDAO().getSKUItemByRFIDFromDB(productInfo.rfid);
		expect(res.length).toStrictEqual(1);
		expect(res[0].available).toStrictEqual(1);

	})

	test(`removeInternalOrderFromDB`, async () => {

		let res = await new InternalOrderDAO().getInternalOrdersFromDB("ALL");
		expect(res.length).toStrictEqual(2);
		res = await new InternalOrderDAO().deleteInternalOrderByIdIntoDB(res[0].id);
		//res = await new InternalOrderDAO().deleteInternalOrderByIdIntoDB(res[1].id);
		res = await new InternalOrderDAO().getInternalOrdersFromDB("ALL");
		expect(res.length).toStrictEqual(1);


	});

	test(`getIssued`, async () => {
		this.data[1].state = "ISSUED";
		await new InternalOrderDAO().createInternalOrder(this.data[1]);
		let res = await new InternalOrderDAO().getInternalOrdersFromDB("ISSUED");
		expect(res.length).toStrictEqual(1);
		res = await new InternalOrderDAO().getInternalOrdersFromDB("ID", res[0].id);
		expect(res[0].date).toStrictEqual(this.data[1].date);
		expect(res[0].state).toStrictEqual(this.data[1].state);
		expect(res[0].fromCustomer).toStrictEqual(this.data[1].fromCustomer);


	});

})
