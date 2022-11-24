const TestUtility = require("../Modules/testUtility")
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test sku api', () => {
    beforeEach(async () => {
        await new TestUtility().deleteData('sku');
        await new TestUtility().deleteData('position');
    })

    newSku(422);
    newSku(422, "", 50, 50, "note", 10, 100);
    newSku(422, "      ", 50, 50, "note", 10, 100);
    newSku(422, { "id": 1 }, 50, 50, "note", 10, 100);
    newSku(422, "aaa", "50", 50, "note", 10, 100);
    newSku(422, "aaa", 50, "50", "note", 10, 100);
    newSku(422, "aaa", 50, 0, "note", 10, 100);
    newSku(422, "aaa", -10, 50, "note", 10, 100);
    newSku(422, "aaa", "50", 50, 1, 10, 100);
    newSku(422, "aaa", 50, 50, "note", "10", 100);
    newSku(422, "aaa", 50, 50, "note", 10, "100");

    newSku(201, "aaa", 50, 50, "note", 10, 100);

    getAllSku(200, "aaa", 50, 50, "note", 10, 100);

    getSkuById(404, 100, "aaa", 50, 50, "note", 10, 100);
    getSkuById(422, "10a0", "aaa", 50, 50, "note", 10, 100);
    getSkuById(200, undefined, "aaa", 50, 50, "note", 10, 100);

    deleteSkuById(422, "10a0", "aaa", 50, 50, "note", 10, 10)
    deleteSkuById(204, undefined, "aaa", 50, 50, "note", 10, 10)

    modifySkuById(404, 100, "aaa", 50, 150, "noteB", 20, 200)
    modifySkuById(422, "code", "aaa", "50", 50, "note", 10, 100)
    modifySkuById(422, undefined, "aaa", "50", 50, "note", 10, 100)
    modifySkuById(422, undefined, "aaa", 50, 50, "note", 10, "100")
    modifySkuById(200, undefined, "bbb", 20, 40, "noteB", 10, 200)

    modifySkuPosition(404, undefined, "800234543417")
    modifySkuPosition(404, 100, "800234543418")
    modifySkuPosition(422, undefined, "800234543")
    modifySkuPosition(422, "100", "800234543")
    modifySkuPosition(200, undefined, "800234543418")
});


function newSku(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    it('adding a new sku', function (done) {

        let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity }
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                agent.get('/api/skus')
                    .then(function (r) {
                        r.should.have.status(200);
                        if (res.status === 201) {
                            r.body.should.have.length(1);
                            r.body[0].description.should.equal(description);
                            r.body[0].weight.should.equal(weight);
                            r.body[0].volume.should.equal(volume);
                            r.body[0].notes.should.equal(notes);
                            r.body[0].price.should.equal(price);
                            r.body[0].availableQuantity.should.equal(availableQuantity);
                        }
                        done();
                    }).catch(done);
            }).catch(done);
    });
}


function getAllSku(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    it('getting all sku from the system', function (done) {
        let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity }
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/skus')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.should.have.length(1);
                        r.body[0].description.should.equal(description);
                        r.body[0].weight.should.equal(weight);
                        r.body[0].volume.should.equal(volume);
                        r.body[0].notes.should.equal(notes);
                        r.body[0].price.should.equal(price);
                        r.body[0].availableQuantity.should.equal(availableQuantity);
                        done();
                    }).catch(done);
            });
    });
}

function getSkuById(expectedHTTPStatus, id, description, weight, volume, notes, price, availableQuantity) {
    it('getting sku by id from the system', function (done) {
        let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity }
        agent.post('/api/sku')
            .send(sku)
            .then(function (r) {
                r.should.have.status(201);
                agent.get('/api/skus')
                    .then(function (r) {
                        r.should.have.status(200);
                        let skuId = id !== undefined ? id : r.body[0].id;
                        agent.get('/api/skus/' + skuId)
                            .then(function (r) {
                                r.should.have.status(expectedHTTPStatus);
                                if (r.status === 200) {
                                    r.body.description.should.equal(description);
                                    r.body.weight.should.equal(weight);
                                    r.body.volume.should.equal(volume);
                                    r.body.notes.should.equal(notes);
                                    r.body.price.should.equal(price);
                                    r.body.availableQuantity.should.equal(availableQuantity);
                                }
                                done();
                            }).catch(done);
                    })
            });
    });
}

function deleteSkuById(expectedHTTPStatus, id, description, weight, volume, notes, price, availableQuantity) {
    it('delete sku by id from the system', function (done) {
        let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity }
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/skus')
                    .then(function (r) {
                        r.should.have.status(200);
                        let skuId = id !== undefined ? id : r.body[0].id;
                        agent.delete('/api/skus/' + skuId)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                agent.get('/api/skus')
                                    .then(function (r) {
                                        r.should.have.status(200);
                                        if (res === 204)
                                            r.body.length.should.equal(0);
                                        done();
                                    }).catch(done);
                            }).catch(done);
                    });
            });
    });
}

function modifySkuById(expectedHTTPStatus, id, newDescription, newWeight, newVolume, newNotes, newPrice, newAvailableQuantity) {
    it('modify sku by id from the system', function (done) {
        let sku = { description: "100", weight: 100, volume: 200, notes: "notes", price: 5, availableQuantity: 10 }
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/skus')
                    .then(function (r) {
                        r.should.have.status(200);
                        let skuId = id !== undefined ? id : r.body[0].id;
                        let newSku = { newDescription: newDescription, newWeight: newWeight, newVolume: newVolume, newNotes: newNotes, newPrice: newPrice, newAvailableQuantity: newAvailableQuantity }
                        agent.put('/api/sku/' + skuId)
                            .send(newSku)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                agent.get('/api/skus')
                                    .then(function (r) {
                                        r.should.have.status(200);
                                        if (res === 200) {
                                            r.body.should.have.length(1);
                                            r.body[0].description.should.equal(newDescription);
                                            r.body[0].weight.should.equal(newWeight);
                                            r.body[0].volume.should.equal(newVolume);
                                            r.body[0].notes.should.equal(newNotes);
                                            r.body[0].price.should.equal(newPrice);
                                            r.body[0].availableQuantity.should.equal(newAvailableQuantity);
                                        }
                                        done();
                                    }).catch(done);
                            }).catch(done);
                    });
            });
    });
}

function modifySkuPosition(expectedHTTPStatus, id, newPosition) {
    it('modify sku position by id from the system', function (done) {
        let sku = { description: "100", weight: 10, volume: 10, notes: "notes", price: 5, availableQuantity: 10 }
        agent.post('/api/sku')
            .send(sku)
            .then(function (r) {
                r.should.have.status(201);
                let pos = { positionID: "800234543418", aisleID: "8002", row: "3454", col: "3418", maxWeight: 1000, maxVolume: 1000 }
                agent.post('/api/position')
                    .send(pos)
                    .then(function (r) {
                        r.should.have.status(201);
                        agent.get('/api/skus')
                            .then(function (r) {
                                r.should.have.status(200);
                                let skuId = id !== undefined ? id : r.body[0].id;
                                agent.put('/api/sku/' + skuId + '/position')
                                    .send({ "position": newPosition })
                                    .then(function (res) {
                                        res.should.have.status(expectedHTTPStatus);
                                        agent.get('/api/skus')
                                            .then(function (r) {
                                                r.should.have.status(200);
                                                if (res === 200) {
                                                    r.body.should.have.length(1);
                                                    r.body[0].position.should.equal(newPosition);
                                                }
                                                done();
                                            }).catch(done);
                                    }).catch(done);
                            }).catch(done);
                    }).catch(done);
            }).catch(done);
    })
}



