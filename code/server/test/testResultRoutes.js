const TestUtility = require("../Modules/testUtility")
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');

var agent = chai.request.agent(app);


describe('test testResult api', () => {
    beforeEach(async () => {
        await new TestUtility().deleteData('testResult');
        await new TestUtility().deleteData('testDescriptor');
        await new TestUtility().deleteData('sku');
        await new TestUtility().deleteData('skuItem');
    })

    after(async () => {
        await new TestUtility().deleteData('testResult');
        await new TestUtility().deleteData('testDescriptor');
        await new TestUtility().deleteData('sku');
        await new TestUtility().deleteData('skuItem');
    });

    //call functions
    newTestResult(422);
    newTestResult(422, undefined, undefined, "2021-11-28", true);
    newTestResult(422, undefined, undefined, "2021/11/28", "true");
    newTestResult(404, "12345678901234567890123458888888", undefined, "2021/11/28", true);
    newTestResult(404, undefined, 12, "2021/11/28", true);
    newTestResult(201, undefined, undefined, "2021/11/28", true);

    modifyTestResult(200, undefined, undefined, undefined, "2021/11/28", true);
    modifyTestResult(404, undefined, undefined, 15, "2021/11/28", true);
    modifyTestResult(404, undefined, "12345678901234567890123457777777", undefined, "2021/11/28", true);
    modifyTestResult(404, 10, undefined, undefined, "2021/11/28", true);
    modifyTestResult(422, undefined, undefined, undefined, "2021-11-28", true);
    modifyTestResult(422, undefined, undefined, undefined, "2021-11-28", "true");
    modifyTestResult(422, "code", undefined, undefined, "2021/11/28", true);
    modifyTestResult(422, undefined, "code", undefined, "2021/11/28", true);
    modifyTestResult(422, undefined, undefined, "code", "2021/11/28", true);





});

function newTestResult(expectedHTTPStatus, rfid, idTestDescriptor, date, result) {

    it('adding a new test result', function (done) {

        let sku = { description: "aaa", weight: 6, volume: 6, notes: "note", price: 6, availableQuantity: 666 }
        agent.post('/api/sku')
            .send(sku)
            .then(function (r) {
                r.should.have.status(201);
                //console.log("sku post status="+r.status);
                agent.get('/api/skus')
                    .then(function (r) {
                        r.should.have.status(200);
                        // console.log("sku get status="+r.status);
                        let skuId = r.body[0].id;

                        let testDescriptor = { name: "test descriptor 6", procedureDescription: "This test is described by...", idSKU: skuId }

                        agent.post('/api/testDescriptor')
                            .send(testDescriptor)
                            .then(function (r) {
                                r.should.have.status(201);
                                // console.log("testDescriptor post status="+r.status);
                                agent.get('/api/testDescriptors')
                                    .then(function (r) {
                                        r.should.have.status(200);
                                        // console.log("testDescriptor get status="+r.status);
                                        let testDescriptorId = idTestDescriptor !== undefined ? idTestDescriptor : r.body[0].id;

                                        let skuItem = { RFID: "12345678901234567890123456789016", SKUId: skuId, DateOfStock: "2021/11/29 12:30" }
                                        agent.post('/api/skuitem')
                                            .send(skuItem)
                                            .then(function (r) {
                                                r.should.have.status(201);
                                                //  console.log("skuitems post status="+r.status);
                                                agent.get('/api/skuitems')
                                                    .then(function (r) {
                                                        r.should.have.status(200);
                                                        //  console.log("skuitems get status="+r.status);
                                                        let skuItemRfid = rfid !== undefined ? rfid : r.body[0].RFID;

                                                        let testResult = { rfid: skuItemRfid, idTestDescriptor: testDescriptorId, Date: date, Result: result }
                                                        agent.post('/api/skuitems/testResult')
                                                            .send(testResult)
                                                            .then(function (res) {
                                                                //console.log("testResult post status="+res.status);
                                                                res.should.have.status(expectedHTTPStatus);
                                                                agent.get('/api/skuitems/' + skuItemRfid + '/testResults')

                                                                    .then(function (r) {
                                                                        //console.log("testResult get status="+r.status);
                                                                        if (res.status === 201) {
                                                                            r.body.should.have.length(1);
                                                                            r.body[0].idTestDescriptor.should.equal(testDescriptorId);
                                                                            r.body[0].Date.should.equal(date);
                                                                            r.body[0].Result.should.equal(result);
                                                                        }
                                                                        done();

                                                                    }).catch(done);
                                                            })
                                                    })
                                            })
                                    })
                            })
                    })

            });

    });
}


function modifyTestResult(expectedHTTPStatus, id, rfid, newIdTestDescriptor, newDate, newResult) {

    it('modify test result', function (done) {

        let sku = { description: "aaa", weight: 6, volume: 6, notes: "note", price: 6, availableQuantity: 666 }
        let sku2 = { description: "bbb", weight: 6, volume: 6, notes: "note", price: 6, availableQuantity: 666 }
        agent.post('/api/sku')
            .send(sku)
            .then(function (r) {
                r.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku2)
                    .then(function (r) {
                        r.should.have.status(201);
                        //console.log("sku post status="+r.status);
                        agent.get('/api/skus')
                            .then(function (r) {
                                r.should.have.status(200);
                                // console.log("sku get status="+r.status);
                                let skuId = r.body[0].id;
                                let skuId2 = r.body[1].id;

                                let testDescriptor = { name: "test descriptor 6", procedureDescription: "This test is described by...", idSKU: skuId }
                                let testDescriptor2 = { name: "test descriptor 7", procedureDescription: "This test is described by...", idSKU: skuId2 }

                                agent.post('/api/testDescriptor')
                                    .send(testDescriptor)
                                    .then(function (r) {
                                        r.should.have.status(201);
                                        // console.log("testDescriptor post status="+r.status);
                                        agent.post('/api/testDescriptor')
                                            .send(testDescriptor2)
                                            .then(function (r) {
                                                r.should.have.status(201);
                                                agent.get('/api/testDescriptors')
                                                    .then(function (r) {
                                                        r.should.have.status(200);
                                                        // console.log("testDescriptor get status="+r.status);
                                                        let testDescriptorId = r.body[0].id;
                                                        let testDescriptorId2 = r.body[1].id;
                                                        let skuItem = { RFID: "12345678901234567890123456789016", SKUId: skuId, DateOfStock: "2021/11/29 12:30" }
                                                        agent.post('/api/skuitem')
                                                            .send(skuItem)
                                                            .then(function (r) {
                                                                r.should.have.status(201);
                                                                //  console.log("skuitems post status="+r.status);
                                                                agent.get('/api/skuitems')
                                                                    .then(function (r) {
                                                                        r.should.have.status(200);
                                                                        //  console.log("skuitems get status="+r.status);
                                                                        let skuItemRfid = r.body[0].RFID;

                                                                        let testResult = { rfid: skuItemRfid, idTestDescriptor: testDescriptorId, Date: "2020/11/28", Result: false }
                                                                        agent.post('/api/skuitems/testResult')
                                                                            .send(testResult)
                                                                            .then(function (r) {
                                                                                //console.log("testResult post status="+r.status);
                                                                                r.should.have.status(201);
                                                                                agent.get('/api/skuitems/' + skuItemRfid + '/testResults')
                                                                                    .then(function (r) {
                                                                                        r.should.have.status(200);
                                                                                        //console.log("testResult get status="+r.status);

                                                                                        let searchRfid = rfid !== undefined ? rfid : skuItemRfid;
                                                                                        let searchTrId = id !== undefined ? id : r.body[0].id;
                                                                                        let idTdNew = newIdTestDescriptor !== undefined ? newIdTestDescriptor : testDescriptorId2;

                                                                                        let newTestResult = {
                                                                                            newIdTestDescriptor: idTdNew,
                                                                                            newDate: newDate,
                                                                                            newResult: newResult
                                                                                        }

                                                                                        //console.log("seaechRfid: " + searchRfid + " searchTdId: " + searchTrId);
                                                                                        //console.log("body td id: " + r.body[0].id);

                                                                                        agent.put('/api/skuitems/' + searchRfid + '/testResult/' + searchTrId)
                                                                                            .send(newTestResult)
                                                                                            .then(function (res) {
                                                                                                //console.log("test result put status: " + res.status);
                                                                                                res.should.have.status(expectedHTTPStatus);
                                                                                                agent.get('/api/skuitems/' + skuItemRfid + '/testResults')
                                                                                                    .then(function (r) {
                                                                                                       // console.log("test result get status: " + r.status);
                                                                                                        r.should.have.status(200);
                                                                                                        if (res === 200) {
                                                                                                            r.body.should.have.length(1);
                                                                                                            r.body[0].idTestDescriptor.should.equal(newIdTestDescriptor);
                                                                                                            r.body[0].Date.should.equal(newDate);
                                                                                                            r.body[0].esult.should.equal(newResult);

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

            });




    });

}