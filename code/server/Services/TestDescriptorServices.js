const TestDescriptorDAO = require("../DAO/TestDescriptorDAO");
const SkuDAO = require("../DAO/SkuDAO");
const TestDescriptor = require("./Data/TestDescriptor");
const Response = require("../Modules/responses");

class TestDescriptorServices {
	constructor() {
	}

	async getAllTestDescriptor() {
		try {
			let rows = await new TestDescriptorDAO().getAllTestDescriptorFromDB();
			let testDescriptors = rows.map((r) => new TestDescriptor().fromDB(r));
			return Response[200](testDescriptors.map((td) => td.intoAPIFormat()));
		} catch (e) {
			return Response[500](e);
		}
	}

	async getTestDescriptorById(id) {
		try {
			TestDescriptor.checkId(id);
		} catch (e) {
			return Response[422](e);
		}
		try {
			let rows = await new TestDescriptorDAO().getTestDescriptorByIdFromDB(id);

			if (rows.length === 0)
				return Response[404]("No test descriptor associated with id: " + id);

			let testDescriptor = new TestDescriptor().fromDB(rows[0]);
			return Response[200](testDescriptor.intoAPIFormat());
		} catch (e) {
			return Response[500](e);
		}
	}

	async createTestDescriptor(rawTestDescriptor) {
		let testDescriptor;
		try {
			testDescriptor = new TestDescriptor().fromAPI(rawTestDescriptor);

			let skuRows = await new SkuDAO().getSKUByIDFromDB(testDescriptor.skuId);
			if (skuRows.length === 0) {
				return Response[404]("No sku associated with id: " + testDescriptor.skuId);
			}
		} catch (e) {
			return Response[422](e);
		}

		try {
			await new TestDescriptorDAO().createTestDescriptorIntoDB(
				testDescriptor.toDBFormat()
			);
			return Response[201]();
		} catch (e) {
			return Response[503](e);
		}
	}

	async modifyTestDescriptorById(id, rawTestDescriptor) {
		let testDescriptor;
		try {
			TestDescriptor.checkId(id);
			testDescriptor = new TestDescriptor().fromAPIModify(rawTestDescriptor);

		} catch (e) {
			return Response[422](e);
		}

		try {
			let rows = await new TestDescriptorDAO().getTestDescriptorByIdFromDB(id);
			if (rows.length === 0)
				return Response[404]("No test descriptor associated with id: " + id);

			let skuRows = await new SkuDAO().getSKUByIDFromDB(testDescriptor.skuId);
			if (skuRows.length === 0) {
				return Response[404]("No sku associated with id: " + testDescriptor.skuId);
			}

			await new TestDescriptorDAO().modifyTestDescriptorByIdIntoDB(
				id,
				testDescriptor.toDBFormat()
			);
			return Response[200]();
		} catch (e) {
			return Response[503](e);
		}
	}

	async deleteTestDescriptorById(id) {
		try {
			TestDescriptor.checkId(id);
		} catch (e) {
			return Response[422](e);
		}
		try {
			await new TestDescriptorDAO().deleteTestDescriptorByIdIntoDB(id);
			return Response[204]();
		} catch (e) {
			return Response[503](e);
		}
	}
}

module.exports = TestDescriptorServices;
