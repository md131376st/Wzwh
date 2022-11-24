const Validation = require("../../Modules/Validation");

class Position {


    positionID;
    aisleID;
    row;
    col;
    maxWeight;
    maxVolume;
    occupiedWeight;
    occupiedVolume;

    constructor() { }

    fromApi(obj) {
        if (typeof obj.aisleID !== 'string' || obj.aisleID.length !== 4)
            throw new Error('AisleId not valid');

        if (typeof obj.row !== 'string' || obj.row.length !== 4)
            throw new Error('Row not valid');

        if (typeof obj.col !== 'string' || obj.col.length !== 4)
            throw new Error('Col not valid');

        Position.checkId(obj.positionID);
        if (!Position.positionIdIsValid(obj.aisleID, obj.row, obj.col, obj.positionID))
            throw new Error('PositionId not valid');

        if (Validation.negativeOrZeroNumber(obj.maxWeight))
            throw new Error('MaxWeight not valid');

        if (Validation.negativeOrZeroNumber(obj.maxVolume))
            throw new Error('MaxVolume not valid');

        this.positionID = obj.positionID;
        this.aisleID = obj.aisleID;
        this.row = obj.row;
        this.col = obj.col;
        this.maxWeight = obj.maxWeight;
        this.maxVolume = obj.maxVolume;
        this.occupiedWeight = 0;
        this.occupiedVolume = 0;

        return this;
    }

    fromDB(obj) {
        this.positionID = obj.positionID;
        this.aisleID = obj.aisle;
        this.row = obj.row;
        this.col = obj.col;
        this.maxWeight = obj.maxWeight;
        this.maxVolume = obj.maxVolume;
        this.occupiedWeight = obj.occupiedWeight;
        this.occupiedVolume = obj.occupiedVolume;

        return this;
    }

    fromAPIModify(obj) {
        let new_p = {
            positionID: `${obj.newAisleID}${obj.newRow}${obj.newCol}`,
            aisleID: obj.newAisleID,
            row: obj.newRow,
            col: obj.newCol,
            maxWeight: obj.newMaxWeight,
            maxVolume: obj.newMaxVolume
        }

        let res = this.fromApi(new_p);

        res.setOccupation(obj.newOccupiedVolume, obj.newOccupiedWeight);

        return res;
    }

    intoDBFormat() {
        return {
            positionID: this.positionID,
            aisle: this.aisleID,
            row: this.row,
            col: this.col,
            maxWeight: this.maxWeight,
            maxVolume: this.maxVolume,
            occupiedWeight: this.occupiedWeight,
            occupiedVolume: this.occupiedVolume,
        }

    }

    intoAPIFormat() {
        return {
            positionID: this.positionID,
            aisleID: this.aisleID,
            row: this.row,
            col: this.col,
            maxWeight: this.maxWeight,
            maxVolume: this.maxVolume,
            occupiedWeight: this.occupiedWeight,
            occupiedVolume: this.occupiedVolume,
        }

    }

    fromId(newPositionID) {
        Position.checkId(newPositionID);

        this.positionID = newPositionID;
        this.aisleID = newPositionID.substring(0, 4)
        this.row = newPositionID.substring(4, 8);
        this.col = newPositionID.substring(8, 12);

        return this;
    }

    setOccupation(volume, weight) {
        if (Validation.negativeNumber(weight))
            throw new Error("Occupied weight has to be a defined, positive number");
        if (weight > this.maxWeight)
            throw new Error("Position is not enought capable for too mutch weight");
        if (Validation.negativeNumber(volume))
            throw new Error("Occupied volume has to be a defined, positive number");
        if (volume > this.maxVolume)
            throw new Error('Position is not enought capable for too mutch volume');

        this.occupiedWeight = weight;
        this.occupiedVolume = volume;

    }

    static checkId(id) {
        if (Validation.isNotDigitStringID(id, 12))
            throw new Error("PositionID "+id+" is wrong: it has to be a 12 digit string");
    }

    static positionIdIsValid(aisle, row, col, positionID){
        let id = `${aisle}${row}${col}`;
        return id === positionID;
    }
}

module.exports = Position;
