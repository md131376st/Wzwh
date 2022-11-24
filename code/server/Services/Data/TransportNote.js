const Validation = require("../../Modules/Validation");

class TransportNote{
    id;
    shipmentDate;

    constructor(){}

    intoAPIFormat(){
        if (this.shipmentDate == null || this.shipmentDate == undefined)
            return { "deliveryDate": null }

        return {"deliveryDate": this.shipmentDate}
    }

    fromDB(obj){
        this.id = obj.id;
        this.shipmentDate = obj.shipmentDate;

        return this;
    }

    transportNoteFromAPI(transportNote){
        if (typeof transportNote !== 'object')
            throw new Error('TransportNote not valid');

        if (!Validation.dateIsValid(transportNote.deliveryDate))
            throw  new Error('TransportNote Date not valid');
        
        return {"shipmentDate" : transportNote.deliveryDate}
    }

    
}

module.exports = TransportNote;