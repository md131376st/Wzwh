const TestUtility = require("../Modules/testUtility")
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const app = require('../server');
var agent = chai.request.agent(app);

describe('test item api', () => {
    before(async () => {
        await new TestUtility().deleteData('item');
        await new TestUtility().deleteData('user');
        await new TestUtility().deleteData('sku');
    })

    after(async () => {
       await new TestUtility().deleteData('item');
       await new TestUtility().deleteData('user');
       await new TestUtility().deleteData('sku');
    });

    newItem(422, 1, "descr", 5, undefined, undefined);
    newItem(422, "1", "descr", "5", undefined, undefined);
    newItem(404, "1", "descr", "5", 0, undefined);
    newItem(404, "1", "descr", "5", undefined, 0);
    newItem(201, "1", "descr", 5, undefined, undefined);

    modifyItem(422, undefined, 10, 5);
    modifyItem(422, undefined, "desc", "price");
    modifyItem(422, "ciao", 33, 22);
    modifyItem(404, 100, "descr", 22); 
    modifyItem(200, undefined, "new descr", 22);

    deleteItem(204, undefined);
    deleteItem(422, "id");
});


function newItem(expectedHTTPStatus, id, description, price, sku, supplier) {
    it('adding a new item', function (done) {
        agent.post('/api/newUser')
            .send({
                "username": "user1@ezwh.com",
                "name": "John",
                "surname": "Smith",
                "password": "testpassword",
                "type": "customer"
            }).then(function (r) {
                //r.should.have.status(201);
                agent.get('/api/users')
                    .then(function (r) {
                        r.should.have.status(200);
                        let userId = supplier !== undefined ? supplier : r.body[0].id;
                        agent.post('/api/sku')
                            .send({
                                "description": "a new sku",
                                "weight": 100,
                                "volume": 50,
                                "notes": "first SKU",
                                "price": 10.99,
                                "availableQuantity": 50
                            })
                            .then(function (r) {
                                //r.should.have.status(201);
                                agent.get('/api/skus')
                                    .then(function (r) {
                                        r.should.have.status(200);
                                        let skuId = sku !== undefined ? sku : r.body[0].id;
                                        let item = { id: id, description: description, price: price, SKUId: skuId, supplierId: userId };
                                        agent.post('/api/item')
                                            .send(item)
                                            .then(function (res) {
                                                res.should.have.status(expectedHTTPStatus);
                                            })
                                        done();
                                    }).catch(done);
                            }).catch(done);
                    }).catch(done);
            }).catch(done);
    })
}


function deleteItem(expectedHTTPStatus, id) {
    it('deleting an item', function (done) {
        agent.get('/api/items')
            .then(function (r) {
                r.should.have.status(200);
                let itemId = id !== undefined ? id : r.body[0].id;
                agent.delete('/api/items/' + itemId)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        agent.get('/api/items')
                            .then(function (r) {
                                r.should.have.status(200);
                                r.body.should.have.length(0);
                                done();
                            }).catch(done);
                    }).catch(done);
            }).catch(done);
    })
}

function modifyItem(expectedHTTPStatus, id, newDescription, newPrice) {
    it('modify item', function (done) {
        agent.get('/api/items')
            .then(function (r) {
                r.should.have.status(200);
                let itemId = id !== undefined ? id : r.body[0].id;
                let newItem = {newDescription: newDescription, newPrice: newPrice};
                agent.put('/api/item/'+itemId)
                .send(newItem)
                .then(function(res){
                    res.should.have.status(expectedHTTPStatus);
                    agent.get('/api/items/'+itemId)
                    .then(function (){
                        if (res.status == 200){
                            r.body[0].description = newDescription;
                            r.body[0].price = newPrice; 
                        }
                        done();
                    }).catch(done);
                }).catch(done);
            }).catch(done);
    })
}
