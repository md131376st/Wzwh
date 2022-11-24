const TestUtility = require("../Modules/testUtility")
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
const agent = chai.request.agent(app);

describe('test Return Order api', () => {

	beforeEach(async () => {
		await new TestUtility().deleteData('returnOrder');
		await new TestUtility().deleteData('restockOrder');
		await new TestUtility().deleteData('item');
		await new TestUtility().deleteData('user');
		await new TestUtility().deleteData('sku');
		await new TestUtility().deleteData('skuItem');
	});


	afterEach(async () => {
		await new TestUtility().deleteData('returnOrder');
		await new TestUtility().deleteData('restockOrder');
		await new TestUtility().deleteData('item');
		await new TestUtility().deleteData('user');
		await new TestUtility().deleteData('sku');
		await new TestUtility().deleteData('skuItem');
	});

	//call functions

	newReturnOrder(422, "2021/11/29 09:33", [{ "SKUId": "ciao", "description": "a product", "price": 10.99, "RFID": undefined }], undefined)
	newReturnOrder(422, "2022/11/29 09:33", [{ "SKUId": undefined, "description": "a product", "price": 10.99, "RFID": "ciao" }], undefined)
	newReturnOrder(422, "2022/11/29 09:33", [{ "SKUId": undefined, "description": "a product", "price": 10.99, "RFID": undefined }], "ciao")

	newReturnOrder(404, "2021/11/29 09:33", [{ "SKUId": undefined, "description": "a product", "price": 10.99, "RFID": undefined,"itemId":1 }], 808)

	newReturnOrder(201, "2022/11/29 09:33", [{ "SKUId": undefined, "description": "a product", "price": 10.99, "RFID": undefined ,"itemId":1}], undefined)

	getReturnOrderById(200,undefined,"2022/11/29 09:33", [{ "SKUId": undefined, "description": "a product", "price": 10.99, "RFID": undefined ,"itemId":1}], undefined);
	getReturnOrderById(404,1000,"2022/11/29 09:33", [{ "SKUId": undefined, "description": "a product", "price": 10.99, "RFID": undefined ,"itemId":1}], undefined);
	getReturnOrderById(422,"code","2022/11/29 09:33", [{ "SKUId": undefined, "description": "a product", "price": 10.99, "RFID": undefined ,"itemId":1}], undefined);



});


function newReturnOrder(expectedHTTPStatus, returnDate, products, restockOrderId) {
	it('adding a new Return Order api ', function (done) {

		agent.post('/api/newUser')
			.send({
				"username": "prova@ezwh.com",
				"name": "A",
				"surname": "B",
				"password": "testpassword",
				"type": "supplier"
			})
			.then(function () {
				agent.get('/api/users')
					.then(function (r) {
						let userId = r.body[0].id;
						agent.post('/api/sku')
							.send({
								"description": "a new sku",
								"weight": 100,
								"volume": 50,
								"notes": "first SKU",
								"price": 10.99,
								"availableQuantity": 50
							})
							.then(function () {
								agent.get('/api/skus')
									.then(function (r) {
										let skuId = r.body[0].id;
										agent.post('/api/item')
											.send({
												"id": 1,
												"description": "a new item",
												"price": 10.99,
												"SKUId": skuId,
												"supplierId": userId
											})
											.then(function () {
												let restockOrder = {
													issueDate: "2021/11/29 09:33",
													supplierId: userId,
													products: [{ "SKUId": skuId, "description": "a product", "price": 10.99, "qty": 30,"itemId":1 }]
												}
												agent.post('/api/restockOrder')
													.send(restockOrder)
													.then(function (r) {
														//console.log("restorckOrder post status="+r.status);
														r.should.have.status(201);
														agent.get('/api/restockOrders')
															.then(function (r) {

																//console.log("restorckOrder get status="+r.status);
																r.should.have.status(200);
																let idRestockOrder = (restockOrderId !== undefined) ? restockOrderId : r.body[0].id;

																let skuItem = { RFID: "91234567801234567890123456789015", SKUId: skuId, DateOfStock: "2021/11/29 12:30" };

																agent.post('/api/skuitem')
																	.send(skuItem)
																	.then(function (r) {
																		//console.log("skuitem post status="+r.status);
																		r.should.have.status(201);
																		agent.get('/api/skuitems')
																			.then(function (r) {
																				//console.log("skuitem get status="+r.status);
																				r.should.have.status(200);
																				let skuItemRfid = r.body[0].RFID;
																				products[0].RFID = products[0].RFID !== undefined ? products[0].RFID : skuItemRfid;
																				products[0].SKUId = products[0].SKUId !== undefined ? products[0].SKUId : skuId;

																				//console.log("products rfid: "+products[0].RFID+", products skuid: "+products[0].SKUId);
																				//console.log("id restock: "+idRestockOrder);

																				let returnOrder = {
																					returnDate: returnDate,
																					restockOrderId: idRestockOrder,
																					products: products
																				}
																				agent.post('/api/returnOrder')
																					.send(returnOrder)
																					.then(function (res) {
																						//console.log("returnOrder post status="+res.status);
																						res.should.have.status(expectedHTTPStatus);
																						agent.get('/api/returnOrders')
																							.then(function (r) {
																								//console.log("returnOrder get status="+r.status);
																								if (res.status == 201) {
																									r.body.should.have.length(1);
																									r.body[0].returnDate.should.equal(returnDate);
																									r.body[0].restockOrderId.should.equal(idRestockOrder);
																								}
																								done();
																							}).catch(done);

																					}).catch(done);



																			}).catch(done);

																	}).catch(done);
															})

													})
											})
									})
							})
					})
			})
	});




}


function getReturnOrderById(expectedHTTPStatus, id, returnDate, products, restockOrderId) {

	it('get a return order by Id', function (done) {

		agent.post('/api/newUser')
			.send({
				"username": "prova@ezwh.com",
				"name": "A",
				"surname": "B",
				"password": "testpassword",
				"type": "supplier"
			})
			.then(function () {
				agent.get('/api/users')
					.then(function (r) {
						let userId = r.body[0].id;
						agent.post('/api/sku')
							.send({
								"description": "a new sku",
								"weight": 100,
								"volume": 50,
								"notes": "first SKU",
								"price": 10.99,
								"availableQuantity": 50
							})
							.then(function () {
								agent.get('/api/skus')
									.then(function (r) {
										let skuId = r.body[0].id;
										agent.post('/api/item')
											.send({
												"id": 1,
												"description": "a new item",
												"price": 10.99,
												"SKUId": skuId,
												"supplierId": userId
											})
											.then(function () {
												let restockOrder = {
													issueDate: "2021/11/29 09:33",
													supplierId: userId,
													products: [{ "SKUId": skuId, "description": "a product", "price": 10.99, "qty": 30,"itemId":1 }]
												}
												agent.post('/api/restockOrder')
													.send(restockOrder)
													.then(function (r) {
														//console.log("restorckOrder post status="+r.status);
														r.should.have.status(201);
														agent.get('/api/restockOrders')
															.then(function (r) {

																//console.log("restorckOrder get status="+r.status);
																r.should.have.status(200);
																let idRestockOrder = (restockOrderId !== undefined) ? restockOrderId : r.body[0].id;

																let skuItem = { RFID: "91234567801234567890123456789015", SKUId: skuId, DateOfStock: "2021/11/29 12:30" };

																agent.post('/api/skuitem')
																	.send(skuItem)
																	.then(function (r) {
																		//console.log("skuitem post status="+r.status);
																		r.should.have.status(201);
																		agent.get('/api/skuitems')
																			.then(function (r) {
																				//console.log("skuitem get status="+r.status);
																				r.should.have.status(200);
																				let skuItemRfid = r.body[0].RFID;
																				products[0].RFID = products[0].RFID !== undefined ? products[0].RFID : skuItemRfid;
																				products[0].SKUId = products[0].SKUId !== undefined ? products[0].SKUId : skuId;

																				let returnOrder = {
																					returnDate: returnDate,
																					restockOrderId: idRestockOrder,
																					products: products
																				}
																																																		agent.post('/api/returnOrder')
																					.send(returnOrder)
																					.then(function (r) {
																						//console.log("returnOrder post status="+r.status);
																						r.should.have.status(201);
																						agent.get('/api/returnOrders')
																							.then(function (r) {
																								//console.log("returnOrder get status="+r.status);

																								let searchId = (id !== undefined )? id : r.body[0].id;

																								agent.get('/api/returnOrders/' + searchId)
																									.then(function (r) {
																										//console.log("returnOrder getbyid status="+r.status);
																										r.should.have.status(expectedHTTPStatus);
																										if (r.status === 200) {
																											r.body.returnDate.should.equal(returnDate);
																											r.body.restockOrderId.should.equal(idRestockOrder);
																										}
																										done();
																									}).catch(done);


																							})
																					})

																			})

																	})
															})

													})
											})
									})
							})
					})
			})





	});



}
