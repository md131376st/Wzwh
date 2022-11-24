const SkuDAO = require("../../DAO/SkuDAO");
const PositionDAO = require("../../DAO/PositionDAO");
const TestUtility = require("../../Modules/testUtility");

describe("testPositionDao", () => {
  beforeAll(async () => {
    await new TestUtility().deleteData("position");
  });

  afterAll(async () => {
    await new TestUtility().deleteData("position");
  });

  testNewPosition();
  testModifyPosition();
  testGetPositionById();

  test("delete position from db", async () => {
    await new PositionDAO().deletePositionByIdIntoDB("800434563421");
    var res = await new PositionDAO().getAllPositionFromDB();
    expect(res.length).toStrictEqual(0);
  });
});

function testNewPosition() {
  test("create a new position", async () => {
    const position = {
      positionID: "800334553420",
      aisle: "8003",
      row: "3455",
      col: "3420",
      maxVolume: 1000,
      maxWeight: 1000,
    };

    try {
      await new PositionDAO().createNewPositionIntoDb(position);
    } catch (e) {
      console.log("error");
    }

    var res = await new PositionDAO().getAllPositionFromDB();
    expect(res.length).toStrictEqual(1);

    expect(res[0].positionID).toStrictEqual(position.positionID);
    expect(res[0].aisle).toStrictEqual(position.aisle);
    expect(res[0].row).toStrictEqual(position.row);
    expect(res[0].col).toStrictEqual(position.col);
    expect(res[0].maxVolume).toStrictEqual(position.maxVolume);
    expect(res[0].maxWeight).toStrictEqual(position.maxWeight);
  });
}

function testModifyPosition() {
  test("modify a position", async () => {

    // var res1 = await new PositionDAO().getAllPositionFromDB();
    // old_PositionID= res1[0].positionID;

    old_PositionID = "800334553420";


    const modifyPosition = {
      positionID: "800434563421",
      aisle: "8004",
      row: "3456",
      col: "3421",
      maxVolume: 1001,
      maxWeight: 1001,
      occupiedWeight: 200,
      occupiedVolume: 100,
    };

    try {
      await new PositionDAO().modifyPositionIntoDB(modifyPosition, old_PositionID);
    } catch (e) {
      console.log("error");
    }

    var res2 = await new PositionDAO().getAllPositionFromDB();
    expect(res2.length).toStrictEqual(1);

    expect(res2[0].positionID).toStrictEqual(modifyPosition.positionID);
    expect(res2[0].aisle).toStrictEqual(modifyPosition.aisle);
    expect(res2[0].row).toStrictEqual(modifyPosition.row);
    expect(res2[0].col).toStrictEqual(modifyPosition.col);
    expect(res2[0].maxVolume).toStrictEqual(modifyPosition.maxVolume);
    expect(res2[0].maxWeight).toStrictEqual(modifyPosition.maxWeight);
    expect(res2[0].occupiedWeight).toStrictEqual(modifyPosition.occupiedWeight);
    expect(res2[0].ocupiedVolume).toStrictEqual(modifyPosition.ocupiedVolume);
  });
}

function testGetPositionById() {
  test("get a position", async () => {
    const modifyPosition = {
      positionID: "800434563421",
      aisle: "8004",
      row: "3456",
      col: "3421",
      maxVolume: 1001,
      maxWeight: 1001,
      occupiedWeight: 200,
      occupiedVolume: 100,
    };

    let pos;

    try {
      pos = await new PositionDAO().getPositionById(modifyPosition.positionID);
    } catch (e) {
      console.log("error");
    }

    expect(pos.length).toStrictEqual(1);

    expect(pos[0].positionID).toStrictEqual(modifyPosition.positionID);
    expect(pos[0].aisle).toStrictEqual(modifyPosition.aisle);
    expect(pos[0].row).toStrictEqual(modifyPosition.row);
    expect(pos[0].col).toStrictEqual(modifyPosition.col);
    expect(pos[0].maxVolume).toStrictEqual(modifyPosition.maxVolume);
    expect(pos[0].maxWeight).toStrictEqual(modifyPosition.maxWeight);
    expect(pos[0].occupiedWeight).toStrictEqual(modifyPosition.occupiedWeight);
    expect(pos[0].ocupiedVolume).toStrictEqual(modifyPosition.ocupiedVolume);

  })
}

