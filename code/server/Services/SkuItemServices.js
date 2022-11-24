const SkuDAO = require("../DAO/SkuDAO");
const SkuItemDAO = require("../DAO/SkuItemDAO");
const SkuItem = require("./Data/SkuItem");
const Sku = require("./Data/Sku");
const Response = require("../Modules/responses");

class SkuItemServices {
  async getAllSKUItem() {
    try {
      const skuItemRows = await new SkuItemDAO().getAllSkuItemFromDB();
      let skuItemList = skuItemRows.map((r) => new SkuItem().fromDB(r));
      return Response[200](skuItemList.map((si) => si.intoAPIFormat(true)));
    } catch (e) {
      return Response[500](e);
    }
  }

  async getAllSKUItemWithASkuId(skuId) {
    try {
      Sku.checkId(skuId);
    } catch (e) {
      return Response[422](e);
    }

    try {
      const row = await new SkuDAO().getSKUByIDFromDB(skuId);
      if (row.length == 0) {
        return Response[404]("No SKU associated to id: " + skuId);
      }

      const skuItemRows = await new SkuItemDAO().getAllSkuItemWithASkuIdFromDB(
        skuId
      );
      let skuItemList = skuItemRows.map((r) => new SkuItem().fromDB(r));
      return Response[200](skuItemList.map((si) => si.intoAPIFormat()));
    } catch (e) {
      return Response[500](e);
    }
  }

  async getSKUItemByRFID(rfid) {
    try {
      SkuItem.checkId(rfid);
    } catch (e) {
      return Response[422](e);
    }

    try {
      const rows = await new SkuItemDAO().getSKUItemByRFIDFromDB(rfid);
      if (rows.length == 0) {
        return Response[404]("No SKUItem associated to rfid: " + rfid);
      }

      let skuItem = new SkuItem().fromDB(rows[0]);
      return Response[200](skuItem.intoAPIFormat(true));
    } catch (e) {
      return Response[500](e);
    }
  }

  async createSKUItem(reqBody) {
    let new_s;
    try {
      new_s = new SkuItem().fromAPI(reqBody);
    } catch (e) {
      return Response[422](e);
    }

    try {

      const row = await new SkuDAO().getSKUByIDFromDB(new_s.skuId);
      if (row.length === 0)
        return Response[404]("No SKU associated to id: " + new_s.skuId);

      await new SkuItemDAO().createSKUItemIntoDB(new_s.intoDBFormat());
      return Response[201]();
    } catch (e) {
      return Response[503](e);
    }
  }

  async modifySKUItem(rfid, reqBody) {
    let skuItem;

    try {
      SkuItem.checkId(rfid);
      skuItem = new SkuItem().fromAPIModify(reqBody);
    } catch (e) {
      return Response[422](e);
    }

    try {
      let rows = await new SkuItemDAO().getSKUItemByRFIDFromDB(rfid);

      if (rows.length === 0)
        return Response[404]("No skuItem associated to rfid" + rfid);
    } catch (e) {
      return Response[503](e);
    }


    try {
      await new SkuItemDAO().modifySKUItemIntoDB(
        skuItem.intoDBFormat(),
        rfid
      );
      return Response[200]();
    } catch (e) {
      return Response[503](e);
    }
  }

  async deleteSkuItemByRFID(rfid) {
    try {
      SkuItem.checkId(rfid);
    } catch (e) {
      return Response[422](e);
    }

    try {
      await new SkuItemDAO().deleteSKUItemByRFIDIntoDB(rfid);
      return Response[204]();
    } catch {
      return Response[503](e);
    }
  }
}

module.exports = SkuItemServices;
