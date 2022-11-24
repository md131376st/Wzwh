const TestUtility = require("../Modules/testUtility")
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const agent = chai.request.agent(app);

describe('test Position api', async () => {
	let pos = {
		positionID: "800234543412",
		aisleID: "8002",
		row: "3454",
		col: "3412",
		maxWeight: 30,
		maxVolume: 20
	};
	beforeEach(async () => {
		await new TestUtility().deleteData('position');
	});


	newPosition(201, pos.positionID, pos.aisleID, pos.row, pos.col, pos.maxWeight, pos.maxWeight);
	newPosition(422, pos.positionID, "800", pos.row, pos.col, pos.maxWeight, pos.maxWeight);
	newPosition(422, pos.positionID, pos.aisleID, 12, pos.col, pos.maxWeight, pos.maxWeight);
	newPosition(422, pos.positionID, pos.aisleID, pos.row, 12.5, pos.maxWeight, pos.maxWeight);
	newPosition(422, pos.positionID, pos.aisleID, pos.row, pos.col, -12, pos.maxWeight);
	newPosition(422, pos.positionID, pos.aisleID, pos.row, pos.col, pos.maxWeight, -12.4);
	newPosition(422);
	modifyDeletePosition(201, 200, 200,
		200, 200, pos.positionID,
		pos.aisleID, pos.row, pos.col, pos.maxWeight, pos.maxWeight, "8002", "3454", "3412",
		1200, 600, 200, 100, "800134543412",
		"8001", "3454", "3412")
	modifyDeletePosition(201, 200, 200,
		422, 200, pos.positionID,
		pos.aisleID, pos.row, pos.col, pos.maxWeight, pos.maxWeight, "8002", "3454", "3412",
		1200, 600, 200, 100, "80023134543412",
		"8001", "3454", "3412")

});


function newPosition(expectedHTTPStatus, positionID, aisleID, row, col, maxWeight, maxVolume) {
	it('adding a new Position', function (done) {
		let position = {
			positionID: positionID,
			aisleID: aisleID,
			row: row,
			col: col,
			maxWeight: maxWeight,
			maxVolume: maxVolume
		}
		agent.post('/api/position')
			.send(position)
			.then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				done();
			}).catch(done);
	});
}

function modifyDeletePosition(PostExpectedHTTPStatus, GetExpectedHTTPStatus, PutExpectedHTTPStatus1,
                              PutExpectedHTTPStatus2, deleteExpectedHTTPStatus, positionID, aisleID, row, col, maxWeight,
                              maxVolume, newAisleID, newRow, newCol, newMaxWeight,
                              newMaxVolume, newOccupiedWeight, newOccupiedVolume, newPositionId,
                              newexpectedaisleID, newExpectedrow, newExpectedcol) {
	it("add a new Position ,edit position info , edit position with new Id and delete position ",
		(done) => {
			let position = {
				positionID: positionID,
				aisleID: aisleID,
				row: row,
				col: col,
				maxWeight: maxWeight,
				maxVolume: maxVolume
			}
			agent.post('/api/position')
				.send(position)
				.then(function (res) {
						res.should.have.status(PostExpectedHTTPStatus);
						if (res.status === 201) {
							agent.get('/api/Positions')
								.then(function (r) {
									r.should.have.status(GetExpectedHTTPStatus);
									if (r.status === 200) {
										let newPosition = {
											newAisleID: newAisleID,
											newRow: newRow,
											newCol: newCol,
											newMaxWeight: newMaxWeight,
											newMaxVolume: newMaxVolume,
											newOccupiedWeight: newOccupiedWeight,
											newOccupiedVolume: newOccupiedVolume
										}
										agent.put('/api/position/' + positionID)
											.send(newPosition)
											.then(function (r) {
												r.should.have.status(PutExpectedHTTPStatus1)
												agent.get('/api/positions')
													.then(function (r) {
														r.should.have.status(200)
														if (r.status === 200) {
															r.body.should.have.length(1);
															r.body[0].aisleID.should.have.equal(newAisleID)
															r.body[0].row.should.equal(newRow)
															r.body[0].col.should.equal(newCol)
															r.body[0].maxWeight.should.equal(newMaxWeight)
															r.body[0].maxVolume.should.equal(newMaxVolume)
															r.body[0].occupiedWeight.should.equal(newOccupiedWeight)
															r.body[0].occupiedVolume.should.equal(newOccupiedVolume)

															agent.put('/api/position/' + r.body[0].positionID + '/changeID')
																.send({
																	newPositionID: newPositionId
																})
																.then(function (r) {

																	r.should.have.status(PutExpectedHTTPStatus2)
																	if (r.status === 200) {
																		agent.get('/api/positions')
																			.then(function (r) {
																				r.should.have.status(200)
																				if (r.status === 200) {
																					r.body[0].aisleID.should.equal(newexpectedaisleID)
																					r.body[0].row.should.equal(newExpectedrow)
																					r.body[0].col.should.equal(newExpectedcol)
																					agent.delete('/api/position/' + newPositionId)
																						.then(function (r) {
																							r.should.have.status(deleteExpectedHTTPStatus)

																						})
																				}

																			})

																	}
																	done();
																})
																.catch(done);
														}


													})
													.catch(done);

											})
									}
								});
						}
					}
				)

		});
}
