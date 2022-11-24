const TestUtility = require("../Modules/testUtility")
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
var agent = chai.request.agent(app);

describe('test restock order api', async () => {
	before(async () => {
		await new TestUtility().deleteData('restockOrder');
		await new TestUtility().deleteData('sku');
		await new TestUtility().deleteData('item');
		await new TestUtility().deleteData('user');
	})

	after(async () => {
		await new TestUtility().deleteData('restockOrder');
		await new TestUtility().deleteData('sku');
		await new TestUtility().deleteData('item');
		await new TestUtility().deleteData('user');
	})

	beforeEach(async () => {
		await new TestUtility().deleteData('sku');
		await new TestUtility().deleteData('item');
		await new TestUtility().deleteData('user');
	})

	newRestockOrder(422, "2021/11/29 09:33", [{
		"SKUId": "ciao",
		"description": "a product",
		"price": 10.99,
		"qty": 30,
		"itemId":1
	}], undefined)
	newRestockOrder(422, "2021/11/29 09:33", [{
		"SKUId": undefined,
		"description": "a product",
		"price": 10.99,
		"qty": 30,
		"itemId":1
	}], "aaa")
	newRestockOrder(201, "2021/11/29 09:33", [{
		"SKUId": undefined,
		"description": "a product",
		"price": 10.99,
		"qty": 30,
		"itemId":1
	}], undefined)
	modifyDeleteRestockOrder( 201, 200, 200,422, 200,
	"2021/11/29 09:33",  [{
		"SKUId": undefined,
		"description": "a product",
		"price": 10.99,
		"qty": 30,
		"itemId":1
	}], undefined, "DELIVERED",
	)
	modifyDeleteRestockOrder( 201, 200, 422,200, 200,
		"2021/11/29 09:33",  [{
			"SKUId": undefined,
			"description": "a product",
			"price": 10.99,
			"qty": 30,
			"itemId":1
		}], undefined, "DELIVERY",
	)


});

function newRestockOrder(expectedHTTPStatus, issueDate, products, supplier) {
	it('create new restock order', function (done) {
		//create supplier
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
						//create sku item
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
										//create item
										agent.post('/api/item')
											.send({
												"id": 1,
												"description": "a new item",
												"price": 10.99,
												"SKUId": skuId,
												"supplierId": userId
											})
											.then(function () {
												products[0].SKUId = products[0].SKUId !== undefined ? products[0].SKUId : skuId;
												let suppId = (supplier !== undefined) ? supplier : userId;
												let restockOrder = {
													issueDate: issueDate,
													supplierId: suppId,
													products: products
												}
												agent.post('/api/restockOrder')
													.send(restockOrder)
													.then(function (res) {
														res.should.have.status(expectedHTTPStatus);
														agent.get('/api/restockOrders')
															.then(function (r) {
																if (res.status === 201) {
																	r.body.should.have.length(1);
																	r.body[0].issueDate.should.equal(issueDate);
																	r.body[0].state.should.equal("ISSUED");
																	r.body[0].supplierId.should.equal(suppId);
																}
																done();
															}).catch(done)

													}).catch(done)
											}).catch(done)
									})
							})
					})
			})
	});
}

function modifyDeleteRestockOrder(expectedHTTPStatus, expectedHTTPStatusPut, expectedHTTPStatusPut1,expectedHTTPStatusPut2,
                                  expectedHTTPStatusDelete,issueDate,products, supplier, newState, newProduct, newtransportNote) {
	it('create new restock order, modify it content and delete it', function (done) {
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
												products[0].SKUId = products[0].SKUId !== undefined ? products[0].SKUId : skuId;
												let suppId = (supplier !== undefined) ? supplier : userId;
												let restockOrder = {
													issueDate: issueDate,
													supplierId: suppId,
													products: products
												}
												agent.post('/api/restockOrder')
													.send(restockOrder)
													.then(function (res) {
														res.should.have.status(expectedHTTPStatus);
														agent.get('/api/restockOrders')
															.then(function (r) {
																if (res.status === 201) {
																	r.body.should.have.length(1);
																	r.body[0].issueDate.should.equal(issueDate);
																	r.body[0].state.should.equal("ISSUED");
																	r.body[0].supplierId.should.equal(suppId);
																	let pruductNum = r.body[0].products.length;
																	let restockOrderId = r.body[0].id;
																	agent.put('/api/restockOrder/' + restockOrderId)
																		.send({
																			newState: newState
																		})
																		.then(function (r) {
																			r.should.have.status(expectedHTTPStatusPut)
																			if (expectedHTTPStatusPut1 !== 404) {
																				newProduct.map((e) => {
																					e.SKUId = skuId
																				})
																			}
																			let newLength = pruductNum + newProduct.length
																			if(expectedHTTPStatusPut1 === 404)
																				restockOrderId = restockOrderId +1
																			agent.put('/api/restockOrder/' + restockOrderId + '/skuItems')
																				.send({
																					skuItems: newProduct
																				})
																				.then(function (r) {
																					r.should.have.status(expectedHTTPStatusPut1)
																					if (res.status === 200) {
																						agent.get('/api/restockOrders/' + restockOrderId)
																							.then(function (r) {
																								r.should.have.status(200)
																								r.body.products.length.should.equal(newLength)
																								if(expectedHTTPStatusPut2 === 404)
																									restockOrderId = restockOrderId +1
																								agent.put('/api/restockOrder/' + restockOrderId + '/transportNote')
																									.send({
																										transportNote: newtransportNote
																									})
																									.then(function (r) {
																										r.should.have.status(expectedHTTPStatusPut2)
																										if(expectedHTTPStatusPut2 ===200 ){
																											agent.get('api/restockOrders/'+restockOrderId)
																												.then( function (r){
																													r.should.have.status(200)
																													r.body.transportNote.should.equal(newtransportNote)
																													if(expectedHTTPStatusDelete ===422)
																														restockOrderId = "test"
																													agent.delete('/api/restockOrder/'+restockOrderId)
																														.then(function (r){
																															r.should.have.status(expectedHTTPStatusDelete)
																														})
																												})
																										}


																									})
																							})

																					}

																				})

																		})

																}
																done();
															})

													})
											})
									})
							})
					})
			})
	});
}
