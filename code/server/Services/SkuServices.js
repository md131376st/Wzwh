const PositionDAO = require("../DAO/PositionDAO");
const SkuDAO = require("../DAO/SkuDAO");
const Position = require("./Data/Position");
const Sku = require("./Data/Sku");
const DBTransactions = require("../DAO/DBTransactions");
const dbTransactions = new DBTransactions();
const Response = require("../Modules/responses");

class SkuServices {
  async getAllSku() {
    try {
      const rawSkuList = await new SkuDAO().getAllSkuFromDB();
      let skuList = [];

      rawSkuList.forEach((s) => {
        skuList.push(new Sku().fromDB(s).intoAPIFormat(true));
      });
      return Response[200](skuList);
    } catch (e) {
      return Response[500](e);
    }
  }

  async getSKUByID(Id) {
    try {
      Sku.checkId(Id);
    } catch (e) {
      return Response[422](e);
    }

    try {
      const skuRows = await new SkuDAO().getSKUByIDFromDB(Id);
      if (skuRows.length == 0) {
        return Response[404]("No SKU associated to id: " + Id);
      }

      let sku = new Sku().fromDB(skuRows[0]);
      return Response[200](sku.intoAPIFormat());
    } catch (e) {
      return Response[500](e);
    }
  }

  async createSku(reqBody) {
    let new_s;
    try {
      new_s = new Sku().fromAPI(reqBody);
    } catch (e) {
      return Response[422](e);
    }

    try {
      await new SkuDAO().createNewSkuIntoDB(new_s.intoDBFormat());
      return Response[201]();
    } catch (e) {
      return Response[503](e);
    }
  }

  async modifySKU(id, reqbody) {
    let oldSku;
    let newSku;

    try {
      Sku.checkId(id);
      newSku = new Sku().fromAPIModify(reqbody);
    } catch (e) {
      return Response[422](e);
    }

    try {
      const oldSkuRow = await new SkuDAO().getSKUByIDFromDB(id);
      if (oldSkuRow.length == 0)
        return Response[404]("No sku associated to id: " + id);

      oldSku = oldSkuRow[0];
    } catch (e) {
      return Response[503](e);
    }

    try {
      dbTransactions.beginTransaction();
    } catch (e) {
      return Response[503](e);
    }

    try {
      let pos;

      await new SkuDAO().modifySkuIntoDB(newSku.intoDBFormat(), id);

      if (oldSku.position != undefined) {
        let posRows = await new PositionDAO().getPositionById(oldSku.position);
        pos = new Position().fromDB(posRows[0]);
        let totalWeight = newSku.weight * newSku.availableQuantity;
        let totalVolume = newSku.volume * newSku.availableQuantity;

        try {
          pos.setOccupation(totalVolume, totalWeight);
        } catch (e) {
          dbTransactions.rollbackTransaction();
          return Response[422](e);
        }

        await new PositionDAO().modifyPositionIntoDB(
          pos.intoDBFormat(),
          pos.positionID
        );
      }

      dbTransactions.commitTransaction();
      return Response[200]();
    } catch (e) {
      dbTransactions.rollbackTransaction();
      return Response[503](e);
    }
  }

  async modifySkuPosition(id, reqBody) {
    let sku; 
    let newPos;

    try {
      Sku.checkId(id);
      Position.checkId(reqBody.position);
    } catch (e) {
      return Response[422](e);
    }

    try {
      let skuRows = await new SkuDAO().getSKUByIDFromDB(id);
      if (skuRows.length === 0)
        return Response[404]("No Sku associated with id: " + id);

      sku = new Sku().fromDB(skuRows[0]);

      let newPosRows = await new PositionDAO().getPositionById(
        reqBody.position
      );
      if (newPosRows.length === 0)
        return Response[404](
          "No position associated with id: " + reqBody.position
        );

      newPos = new Position().fromDB(newPosRows[0]);

      if (await new PositionDAO().isPositionAssignedIntoDB(newPos.positionID)) {
        return Response[422](
          "Position with is: " +
          newPos.positionID +
          " is already assigned to a sku"
        );
      }
    } catch (e) {
      return Response[503](e);
    }


    try {
      dbTransactions.beginTransaction();
    } catch (e) {
      return Response[503](e);
    }

    try {
      if (sku.pos != undefined) {
        let oldPosRows = await new PositionDAO().getPositionById(sku.pos);

        let oldPos = new Position().fromDB(oldPosRows[0]);

        oldPos.setOccupation(0, 0);

        await new PositionDAO().modifyPositionIntoDB(
          oldPos.intoDBFormat(),
          oldPos.positionID
        );
      }

      let totalWeight = sku.weight * sku.availableQuantity;
      let totalVolume = sku.volume * sku.availableQuantity;

      try {
        newPos.setOccupation(totalWeight, totalVolume);
      } catch (e) {
        dbTransactions.rollbackTransaction()
        return Response[422](e);
      }

      await new PositionDAO().modifyPositionIntoDB(
        newPos.intoDBFormat(),
        newPos.positionID
      );

      await new SkuDAO().modifySkuPositionIntoDB(sku.id, newPos.positionID);

      dbTransactions.commitTransaction();
      return Response[200]();
    } catch (e) {
      dbTransactions.rollbackTransaction();
      return Response[503](e);
    }
  }

  async deleteSku(id) {
    try {
      Sku.checkId(id);
    } catch (e) {
      return Response[422](e);
    }
    try {
      await new SkuDAO().deleteSkuByIdIntoDB(id);
      return Response[204]();
    } catch (e) {
      return Response[503](e);
    }
  }
}

module.exports = SkuServices;
