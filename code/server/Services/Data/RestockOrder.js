const Validation = require("../../Modules/Validation");
const User = require("./User")
const ProductWithSkuAndQuantity = require("./ProductWithSkuAndQuantity");
const SkuItem = require("./SkuItem");
const Item = require("./Item");

class RestockOrder {
    id;
    issueDate;
    state;
    supplierId;
    transportNote;
    products;
    skuItems;

    constructor() { }

    intoAPIFormat(obj, transportNote, skuItems, products, withID) {
        if (withID)
            this.id = obj.id;

        this.issueDate = obj.issueDate;
        this.state = obj.state;
        this.supplierId = obj.supplierId;

        if (transportNote)
            this.transportNote = transportNote;

        this.products = products;
        this.skuItems = skuItems;

        return this;
    }

    fromAPI(obj) {
        if (!Validation.dateIsValid(obj.issueDate))
            throw new Error('IssueDate not valid');

        User.checkId(obj.supplierId);

        if (!Array.isArray(obj.products) || obj.products.length === 0)
            throw new Error("products has to be an array longerthan 0");

        let products = obj.products.map((p) => { 
            const product = new ProductWithSkuAndQuantity().fromAPI(p)
            Item.checkId(p.itemId); 
            product.itemId = p.itemId;
            return product; 
        });

        this.supplierId = obj.supplierId;
        this.issueDate = obj.issueDate;
        this.products = products

        return this;
    }

    intoDBFormat() {
        return {
            issueDate: this.issueDate,
            state: "ISSUED",
            supplier: this.supplierId
        }
    }

    fromDB(obj) {
        this.id = obj.id;
        this.issueDate = obj.issueDate;
        this.state = obj.state;
        this.supplierId = obj.supplier;
        this.transportNote = obj.transportNote;

        return this;
    }

    static checkNewState(newState) {
        if (Validation.emptyString(newState) || (
            newState !== 'ISSUED' && newState !== 'DELIVERY' && newState !== 'DELIVERED'
            && newState !== 'TESTED' && newState !== 'COMPLETEDRETURN' && newState !== 'COMPLETED'))
            throw new Error('NewState not valid');
    }

    static checkId(id) {
        if (Validation.isNotNumericID(id)) {
            throw new Error("Restock Order id has to be a defined number");
        }
    }

    skuItemsFromAPI(skuItems) {
        if (!Array.isArray(skuItems) || skuItems.length === 0)
            throw new Error("Sku items has to be an array longerthan 0");

        return skuItems.map((s) => new SkuItem().newSkuItemForRestockOrder(s))
    }


}

module.exports = RestockOrder;
