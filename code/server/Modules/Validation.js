const dayjs = require("dayjs");
let customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

class Validation {

    static emptyString(string) {
        return typeof string !== "string" || string.trim() === ""
    }

    static negativeOrZeroNumber(number) {
        return typeof number !== "number" || number <= 0
    }

    static negativeNumber(number) {
        return typeof number !== "number" || number < 0
    }

    static countDecimal(value) {
        if (typeof value !== 'number')
            return -1;
        if (Math.floor(value) !== value)
            return value.toString().split(".")[1].length || 0;
        return 0;
    }

    static isNotPrice(value) {
        return Validation.negativeOrZeroNumber(value) || Validation.countDecimal(value) > 2
    }

    static isNotNumericID(id) {
        return (typeof id === 'string' && Validation.emptyString(id)) || id == null || isNaN(Number(id)) || !Number.isInteger(Number(id)) || Validation.negativeNumber(Number(id));
    }

    static isNotDigitStringID(id, length) {
        return typeof id !== 'string' || id.length !== length || !(/^\d+$/.test(id))
    }

    static dateIsValidOrNull(date) {
        return date == undefined || Validation.dateIsValid(date)
    }

    static dateIsValid(date){
        let dateInFormat1 = dayjs(date, "YYYY/MM/DD HH:mm", true);
        let dateInFormat2 = dayjs(date, "YYYY/MM/DD", true);
        return dateInFormat1.isValid() || dateInFormat2.isValid();
    }

    static isInThePast(rawDate) {
        let date = dayjs(rawDate);
        return !date.isAfter(dayjs());
    }

    static isValidInThePastOrNull(date) {
        return (date === null || (Validation.dateIsValid(date) && Validation.isInThePast(date)));
    }

    static isNotBoolean(field){
        return typeof field !== 'boolean'
    }

    static notValidEmail(email) {
        return (typeof email !== "string") ||( !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)));
    }
}



module.exports = Validation;
