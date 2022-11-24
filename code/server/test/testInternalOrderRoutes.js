const TestUtility = require("../Modules/testUtility")
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
var agent = chai.request.agent(app);

describe('test internal order api', async () => {
    beforeEach(async () => {
        await new TestUtility().deleteData('internalOrder');
        await new TestUtility().deleteData('sku');
        await new TestUtility().deleteData('user');
        await new TestUtility().deleteData('item');
    })

    after(async () => {
        await new TestUtility().deleteData('internalOrder');
        await new TestUtility().deleteData('sku');
        await new TestUtility().deleteData('user');
        await new TestUtility().deleteData('item');
    })

    //call functions
    newInternalOrder(201, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 30 }], undefined)
    newInternalOrder(422, "2021/11/29 09:33", [{ "SKUId": "ciao", "description": "a product", "price": 10.99, "qty": 30 }], undefined)
    newInternalOrder(422, "2021/11/29 09:33", [{ "SKUId": undefined, "description": "a product", "price": 10.99, "qty": 30 }], "aaa")
    newInternalOrder(201, "2021/11/29 09:33", [{ "SKUId": undefined, "description": "a product", "price": 10.99, "qty": 30 }], undefined)

    modifyInternalOrder(200, undefined, "COMPLETED", [{ "SkuID": 50, "RFID": undefined }]);
    modifyInternalOrder(404, 2048, "COMPLETED", [{ "SkuID": undefined, "RFID": undefined }]);
    modifyInternalOrder(422, undefined, "COMPLETED");
    modifyInternalOrder(422, "code", "COMPLETED", [{ "SkuID": undefined, "RFID": undefined }]);
    //modifyInternalOrder(422, undefined, "FINISHED", [{ "SkuID": undefined, "RFID": undefined }]);
    modifyInternalOrder(422, undefined, "COMPLETED", [{ "SkuID": undefined, "RFID": "rfidddd" }]);
    //modifyInternalOrder(422, undefined, "RECEIVED");
    modifyInternalOrder(200, undefined, "ACCEPTED");
    modifyInternalOrder(200, undefined, "COMPLETED", [{ "SkuID": undefined, "RFID": undefined }]);


});

function newInternalOrder(expectedHTTPStatus, issueDate, products, customer) {

    it('create new internal order', function (done) {
        let user = {
            "username": "user1@ezwh.com",
            "name": "John",
            "surname": "Smith",
            "password": "testpassword",
            "type": "customer"
        }
        agent.post('/api/newUser')
            .send(user)
            .then(function (r) {
                r.should.have.status(201);
                agent.get('/api/users')
                    .then(function (r) {
                        r.should.have.status(200);
                        let userId = r.body[0].id;

                        let sku = {
                            "description": "a new sku",
                            "weight": 100,
                            "volume": 50,
                            "notes": "first SKU",
                            "price": 10.99,
                            "availableQuantity": 50
                        }
                        agent.post('/api/sku')
                            .send(sku)
                            .then(function (r) {
                                r.should.have.status(201);
                                agent.get('/api/skus')
                                    .then(function (r) {
                                        r.should.have.status(200);
                                        let skuId = r.body[0].id;
                                        let item = {
                                            "id": 12,
                                            "description": "a new item",
                                            "price": 10.99,
                                            "SKUId": skuId,
                                            "supplierId": userId
                                        }
                                        agent.post('/api/item')
                                            .send(item)
                                            .then(function (r) {
                                                r.should.have.status(201);
                                                products[0].SKUId = products[0].SKUId !== undefined ? products[0].SKUId : skuId;

                                                let internalOrder = {
                                                    issueDate: issueDate,
                                                    products: products,
                                                    customerId: (customer !== undefined) ? customer : userId,
                                                }

                                                agent.post('/api/internalOrders')
                                                    .send(internalOrder)
                                                    .then(function (res) {
                                                        //console.log("post io status: "+res.status);

                                                        res.should.have.status(expectedHTTPStatus);
                                                        agent.get('/api/internalOrders')
                                                            .then(function (r) {
                                                                r.should.have.status(200);
                                                                //console.log("get io status: "+r.status);
                                                                if (res.status == 201) {
                                                                    r.body.should.have.length(1);
                                                                    r.body[0].issueDate.should.equal(issueDate);
                                                                    r.body[0].state.should.equal("ISSUED");
                                                                    //console.log("table customer ID: "+r.body[0].customerId);
                                                                    //console.log("inside customer ID: "+userId);
                                                                    r.body[0].customerId.should.equal(userId);
                                                                }
                                                                done();
                                                            }).catch(done);
                                                    }).catch(done);
                                            }).catch(done);
                                    }).catch(done);
                            }).catch(done);

                    })
            })



    });

}


function modifyInternalOrder(expectedHTTPStatus, id, newState, products) {

    it('modify an internal order', function (done) {

        let user = {
            "username": "user1@ezwh.com",
            "name": "John",
            "surname": "Smith",
            "password": "testpassword",
            "type": "customer"
        }
        agent.post('/api/newUser')
            .send(user)
            .then(function (r) {
                r.should.have.status(201);
                agent.get('/api/users')
                    .then(function (r) {
                        r.should.have.status(200);
                        let userId = r.body[0].id;

                        let sku = {
                            "description": "a new sku",
                            "weight": 100,
                            "volume": 50,
                            "notes": "first SKU",
                            "price": 10.99,
                            "availableQuantity": 50
                        }
                        agent.post('/api/sku')
                            .send(sku)
                            .then(function (r) {
                                r.should.have.status(201);
                                agent.get('/api/skus')
                                    .then(function (r) {
                                        r.should.have.status(200);
                                        let skuId = r.body[0].id;

                                        let skuItem = { RFID: "12345678901234567890123456789016", SKUId: skuId, DateOfStock: "2021/11/29 12:30" }
                                        agent.post('/api/skuitem')
                                            .send(skuItem)
                                            .then(function (r) {
                                                r.should.have.status(201);
                                                //  console.log("skuitems post status="+r.status);
                                                agent.get('/api/skuitems')
                                                    .then(function (r) {
                                                        r.should.have.status(200);
                                                        let rfid = r.body[0].RFID;
                                                        //  console.log("skuitems get status="+r.status);
                                                        let item = {
                                                            "id": 12,
                                                            "description": "a new item",
                                                            "price": 10.99,
                                                            "SKUId": skuId,
                                                            "supplierId": userId
                                                        }
                                                        agent.post('/api/item')
                                                            .send(item)
                                                            .then(function (r) {
                                                                r.should.have.status(201);

                                                                let internalOrder = {
                                                                    issueDate: "2020/11/29 09:33",
                                                                    products: [{ "SKUId": skuId, "description": "a product", "price": 10.99, "qty": 1 }],
                                                                    customerId: userId,
                                                                }

                                                                agent.post('/api/internalOrders')
                                                                    .send(internalOrder)
                                                                    .then(function (r) {
                                                                        //console.log("post io status: " + r.status);

                                                                        r.should.have.status(201);
                                                                        agent.get('/api/internalOrders')
                                                                            .then(function (r) {
                                                                                //console.log("get io status: " + r.status);
                                                                                r.should.have.status(200);

                                                                                //MODIFY
                                                                                let ioId = id !== undefined ? id : r.body[0].id;

                                                                                if (products !== undefined) {
                                                                                    products[0].SkuID = products[0].SkuID !== undefined ? products[0].SkuID : skuId;
                                                                                    products[0].RFID = products[0].RFID !== undefined ? products[0].SKUId : rfid;
                                                                                } else {
                                                                                    products = undefined;
                                                                                }

                                                                                let modifyIO = {
                                                                                    newState: newState,
                                                                                    products: products,
                                                                                }

                                                                                //console.log("ioId=  " + ioId + " newstate: " + modifyIO.newState);
                                                                                //console.log("product skuid=  " + modifyIO.products[0].SkuID + "  product rfid: " + modifyIO.products[0].RFID);

                                                                                agent.put('/api/internalOrders/' + ioId)
                                                                                    .send(modifyIO)
                                                                                    .then(function (res) {
                                                                                        //console.log("io put status: " + res.status);
                                                                                        res.should.have.status(expectedHTTPStatus);
                                                                                        agent.get('/api/internalOrders')
                                                                                            .then(function (r) {
                                                                                               // console.log("io get status: " + r.status);

                                                                                                r.should.have.status(200);
                                                                                                if (res === 200) {
                                                                                                    r.body.should.have.length(1);
                                                                                                    r.body[0].state.should.equal(newState);
                                                                                                    //products
                                                                                                }
                                                                                                done();
                                                                                            }).catch(done);
                                                                                    }).catch(done);


                                                                            }).catch(done);
                                                                    }).catch(done);
                                                            }).catch(done);
                                                    }).catch(done);
                                            }).catch(done);
                                    }).catch(done);
                            })

                    })
            })




    })

}