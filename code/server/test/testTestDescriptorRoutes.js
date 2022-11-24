const TestUtility = require("../Modules/testUtility")
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const SkuDAO = require("../DAO/SkuDAO");
const agent = chai.request.agent(app);

describe('test Test Descriptor api',
	() => {

		let testDes;
		beforeEach(async () => {
			await new TestUtility().deleteData('testDescriptor');
			await new TestUtility().deleteData('sku');
		});


		testDes = {
			name: "test descriptor 3",
			procedureDescription: "This test is described by...",

		}
		let newTestDes = {
			name: "test descriptor 2",
			procedureDescription: "This test is described by Mona ",

		}

		newTestDescriptor(422, 12, testDes.procedureDescription)
		newTestDescriptor(422, testDes.name, -21)
		newTestDescriptor(422, testDes.name, undefined)

		newTestDescriptor(201, testDes.name, testDes.procedureDescription)
		newTestDescriptor(404, testDes.name, testDes.procedureDescription)
		modifyDeleteTestDescriptor(201,200,testDes.name,
			testDes.procedureDescription, newTestDes.name, newTestDes.procedureDescription, false )
		modifyDeleteTestDescriptor(201,404,testDes.name,
			testDes.procedureDescription, newTestDes.name, newTestDes.procedureDescription, true )
		modifyDeleteTestDescriptor(201,404,testDes.name,
			testDes.procedureDescription, newTestDes.name, newTestDes.procedureDescription, false )
		modifyDeleteTestDescriptor(201,422,testDes.name,
			testDes.procedureDescription, 12, newTestDes.procedureDescription, false )

		afterEach(async () => {
			await new TestUtility().deleteData('testDescriptor');
			await new TestUtility().deleteData('sku');
		});


	});


function newTestDescriptor(expectedHTTPStatus, name, procedureDescription, skid) {
	it('adding a new Test Descriptor', function (done) {
		let sku =
			{
				description: "a new sku",
				weight: 100,
				volume: 50,
				notes: "first SKU",
				position: "800234523412",
				availableQuantity: 50,
				price: 10.99,

			};
		agent.post('/api/sku')
			.send(sku)
			.then(function (r) {
				r.should.have.status(201);
				agent.get('/api/skus')
					.then(function (r) {
						r.should.have.status(200);
						let skuId = r.body[0].id;
						if (expectedHTTPStatus === 404)
							skuId = skuId + 1;

						let testDes = {
							name: name,
							procedureDescription: procedureDescription,
							idSKU: skuId
						}

						agent.post('/api/testDescriptor')
							.send(testDes)
							.then(function (res) {
								res.should.have.status(expectedHTTPStatus);
								done();
							}).catch(done);
					});
			});
	});
}

function modifyDeleteTestDescriptor(expectedHTTPStatusPost, expectedHTTPStatusPut,
                                    name, procedureDescription,
                                    newName, newProcedureDescription, notFound) {
	it('adding a new Test Descriptor, modify it and delete it ', function (done) {
		let sku =
			{
				description: "a new sku",
				weight: 100,
				volume: 50,
				notes: "first SKU",
				position: "800234523412",
				availableQuantity: 50,
				price: 10.99,

			};
		agent.post('/api/sku')
			.send(sku)
			.then(function (r) {
				r.should.have.status(201);
				agent.get('/api/skus')
					.then(function (r) {
						r.should.have.status(200);
						let skuId = r.body[0].id;

						let testDes = {
							name: name,
							procedureDescription: procedureDescription,
							idSKU: skuId
						}
						let newSku =
							{
								description: "one sku",
								weight: 100,
								volume: 50,
								notes: "first SKU",
								position: "800234523411",
								availableQuantity: 50,
								price: 10.99,

							};
						agent.post('/api/sku')
							.send(newSku)
							.then(function (r) {
								r.should.have.status(201);
								agent.get('/api/skus')
									.then(function (r) {
										r.should.have.status(200);
										let newSkuId = r.body[1].id;
										if (expectedHTTPStatusPut === 404 && notFound === false)
											newSkuId = newSkuId + 1;
										agent.post('/api/testDescriptor')
											.send(testDes)
											.then(function (res) {
												res.should.have.status(expectedHTTPStatusPost);
												agent.get('/api/testDescriptors')
													.then(function (r) {
														r.should.have.status(200)
														r.body.should.have.length(1);
														let newTestDescriptor = {
															newName: newName,
															newProcedureDescription: newProcedureDescription,
															newIdSKU: newSkuId
														}
														let testDescriptorId = r.body[0].id
														if (notFound === true)
															testDescriptorId = testDescriptorId * 10
														agent.put('/api/testDescriptor/' + testDescriptorId)
															.send(newTestDescriptor)
															.then(function (r) {
																r.should.have.status(expectedHTTPStatusPut)
																if (r.status === 200) {

																	agent.get('/api/testDescriptors/' + testDescriptorId)
																		.then(function (r) {
																			r.body.name.should.equal(newName)
																			r.body.procedureDescription.should.equal(newProcedureDescription)
																			r.body.idSKU.should.equal(skuId)
																			agent.delete('/api/testDescriptor/' + testDescriptorId)
																				.then(function (r) {
																					r.should.have.status(402)
																					done();
																				}).catch(done);
																		})
																}

																	done();


															})


													})
											})
									});
							})


					});
			});
	})
}

