const PositionDAO = require("../DAO/PositionDAO");
const Position = require("./Data/Position");
const Response = require("../Modules/responses");

class PositionServices {
  async getAllPositions() {
    try {
      const positionList = await new PositionDAO().getAllPositionFromDB();

      const pos = positionList.map( (p) => new Position().fromDB(p).intoAPIFormat());
      return Response[200](pos);
    } catch (e) {
      return Response[500](e);
    }
  }

  async createPosition(reqBody) {
    let new_p;

    try {
      new_p = new Position().fromApi(reqBody);
    } catch (e) {
      return Response[422](e);
    }

    try {
      await new PositionDAO().createNewPositionIntoDb(
        new_p.intoDBFormat()
      );
      return { status: 201 };
    } catch (e) {
      return Response[503](e);
    }
  }

  async modifyPositionById(id, reqBody) {
    let new_p;

    try {
      Position.checkId(id);
      new_p = new Position().fromAPIModify(reqBody);
    } catch (e) {
      return Response[422](e);
    }

    try {
      const row = await new PositionDAO().getPositionById(id);
      if (row.length == 0)
        return Response[404]("No position with id: " + id);
    } catch (e) {
      return Response[503](e);
    }

    try {
      await new PositionDAO().modifyPositionIntoDB(
        new_p.intoDBFormat(),
        id
      );
      return Response[200]();
    } catch (e) {
      return Response[503](e);
    }
  }

  async modifyPositionId(id, reqBody) {

    let new_p;

    try {
      Position.checkId(id);
      new_p = new Position().fromId(reqBody.newPositionID);
    } catch (e) {
      return Response[422](e);
    }

    try {
      const row = await new PositionDAO().getPositionById(id);
      if (row.length == 0)
        return Response[404]("No position with id: " + id);
    } catch (e) {
      return Response[503](e);
    }

    try {
      await new PositionDAO().modifyPositionIDIntoDb(
        id,
        new_p.intoDBFormat()
      );
      return Response[200]();
    } catch (e) {
      return Response[503](e);
    }
  }

  async deletePositionById(id) {

    try {
      Position.checkId(id);
    } catch (e) {
      return Response[422](e);
    }

    try {
      await new PositionDAO().deletePositionByIdIntoDB(id);
      return Response[204]();
    } catch (e) {
      return Response[503](e);
    }
  }

}

module.exports = PositionServices;
