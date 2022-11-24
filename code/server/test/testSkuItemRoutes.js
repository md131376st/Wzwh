const TestUtility = require("../Modules/testUtility")
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('test skuItem api', () => {
    beforeEach(async () => {
        await new TestUtility().deleteData('skuItem');
        await new TestUtility().deleteData('sku');
    })

    after(async () => {
        await new TestUtility().deleteData('skuItem');
        await new TestUtility().deleteData('sku');
    })

    //call functions
    newSkuItem(422);
    newSkuItem(404, "91234567801234567890123456789015", 2, "2021/11/29 12:30");
    newSkuItem(422, "91234567801234567890123456", undefined, "2021/11/29 12:30");
    newSkuItem(422, "91234567801234567890123456789015", undefined, "2021-11-29 12.30");
    newSkuItem(422, "91234567801234567890123456789015", "code", "2021/11/29 12:30");

    newSkuItem(201, "91234567801234567890123456789015", undefined, "2021/11/29 12:30");

    modifySkuItemByRfid(404, "77777567801234567890123456789015", "88888567801234567890123456789015", 1,"2021/11/29 12:30")
    modifySkuItemByRfid(422, "rfid", "88888567801234567890123456789015", 1,"2021/11/29 12:30")
    modifySkuItemByRfid(422, undefined, "rfid", 1,"2021/11/29 12:30")
    modifySkuItemByRfid(422, undefined, "88888567801234567890123456789015", "available","2021/11/29 12:30")
    modifySkuItemByRfid(200, undefined, "66666567801234567890123456789015", 1, "2021/11/29 12:30")



});

function newSkuItem(expectedHTTPStatus, rfid, skuId, dateOfStock) {
    it('adding a new skuItem', function (done) {

        let sku = { description: "aaa", weight: 6, volume: 6, notes: "note", price: 6, availableQuantity: 666 }
        agent.post('/api/sku')
            .send(sku)
            .then(function (r) {
                r.should.have.status(201);
                agent.get('/api/skus')
                    .then(function (r) {
                        r.should.have.status(200);
                        let skuId1 = skuId !== undefined ? skuId : r.body[0].id;
                        let skuItem = { RFID: rfid, SKUId: skuId1, DateOfStock: dateOfStock }

                        agent.post('/api/skuitem')
                            .send(skuItem)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                agent.get('/api/skuitems')
                                    .then(function (r) {
                                        r.should.have.status(200);
                                        if (res.status === 201) {
                                            r.body.should.have.length(1);
                                            r.body[0].RFID.should.equal(rfid);
                                            r.body[0].SKUId.should.equal(skuId1);
                                            r.body[0].DateOfStock.should.equal(dateOfStock);
                                            r.body[0].Available.should.equal(0);
                                        }
                                        done();
                                    }).catch(done);
                            })
                    })
            });
    });
}


function modifySkuItemByRfid(expectedHTTPStatus, rfid, newRFID, newAvailable, newDateOfStock) {

    it('modify skuItem by rfid from the system', function (done) {

        let sku = { description: "aaa", weight: 6, volume: 6, notes: "note", price: 6, availableQuantity: 666 }
        agent.post('/api/sku')
            .send(sku)
            .then(function (r) {
                r.should.have.status(201);
                agent.get('/api/skus')
                    .then(function (r) {
                        r.should.have.status(200);
                        let skuId = r.body[0].id;
                        let skuItem = { RFID: "88885678901234567890123456789015", SKUId: skuId, DateOfStock: "2020/11/29 12:30" }

                        agent.post('/api/skuitem')
                            .send(skuItem)
                            .then(function (r) {
                                r.should.have.status(201);
                                agent.get('/api/skuitems')
                                    .then(function (r) {
                                        r.should.have.status(200);

                                        let oldrfid = rfid !== undefined ? rfid : r.body[0].RFID;

                                        let newSkuItem = {
                                            newRFID: newRFID,
                                            newAvailable: newAvailable,
                                            newDateOfStock: newDateOfStock
                                        }

                                        // console.log("oldRfid: "+oldrfid+" newRfid: "+newRFID+" body rfid: "+r.body[0].RFID);
                                        agent.put('/api/skuitems/' + oldrfid)
                                            .send(newSkuItem)
                                            .then(function (res) {
                                                //console.log("skuitem put status: "+res.status);
                                                res.should.have.status(expectedHTTPStatus);
                                                agent.get('/api/skuitems')
                                                    .then(function (r) {
                                                        //console.log("skuitem get status: "+r.status);

                                                        r.should.have.status(200);
                                                        if (res === 200) {
                                                            r.body.should.have.length(1);
                                                            r.body[0].RFID.should.equal(newRFID);
                                                            r.body[0].SKUId.should.equal(skuId);
                                                            r.body[0].Available.should.equal(newAvailable);
                                                            r.body[0].DateOfStock.should.equal(newDateOfStock);
                                                        }
                                                        done();
                                                    }).catch(done);
                                            })

                                    })
                            })
                    })
            })
    })



}





