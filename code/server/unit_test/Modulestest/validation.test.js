const Validation = require('../../Modules/Validation');
const Position = require('../../Services/Data/Position');

//test empty strings
describe("test Validation.emptyCString", () => {
	let input = ["", "abc", undefined, null, "   "];
	let expectResult = [true, false, true, true, true];
	for (let i = 0; i < input.length; i++) {
		testEmptyString(input[i], expectResult[i]);
	}

});
function testEmptyString(input, expectedOutput) {
	test('test empty string function', () => {
		expect(Validation.emptyString(input)).toStrictEqual(expectedOutput)
	});
}
//test negetive, zero numbers
describe("test Validation negativeOrZeroNumber",()=>{
	let input = [-1, 12, 12.4, -1.4 ,0, "hi", ' ', undefined, null, "32", Number.MAX_VALUE, Number.MIN_SAFE_INTEGER];
	let expectResult = [true, false, false,true,true, true,true, true,true, true, false, true];
	for (let i = 0; i < input.length; i++) {
		testnegativeOrZeroNumber(input[i], expectResult[i]);
	}
});

function testnegativeOrZeroNumber(input, expectedOutput) {
	test('test negativeOrZeroNumber function', () => {
		expect(Validation.negativeOrZeroNumber(input)).toStrictEqual(expectedOutput)
	});
}

//test negetive number
describe("test Validation negativeNumber",()=>{
	let input = [-1, "hi", ' ', undefined, null,12,12.3, -12.2];
	let expectResult = [true, true, true,true, true,false, false, true];
	for (let i = 0; i < input.length; i++) {
		testnegativeNumber(input[i], expectResult[i]);
	}
});

function testnegativeNumber(input, expectedOutput) {
	test('test negative number function', () => {
		expect(Validation.negativeNumber(input)).toStrictEqual(expectedOutput)
	});
}
//test countDecimal

describe("test count decimal",()=>{
	let input = [-1, 12 ,12.3, -12.234, "hi", undefined];
	let expectResult = [0,0,1,3, -1, -1];
	for (let i = 0; i < input.length; i++) {
		//console.log("input: "+ input[i]+ " output: " + expectResult[i] )
		testCountDecimal(input[i], expectResult[i]);
	}
});

function testCountDecimal(input, expectedOutput) {
	test('test countDecimal function', () => {
		expect(Validation.countDecimal(input)).toStrictEqual(expectedOutput)
	});
}

//test isNotPrice
describe("test not Price",()=>{
	let input = [-1, "test", ' ', undefined, null,12 ,12.3, -12.234];
	let expectResult = [true, true,true,true, true ,false, false,true ];
	for (let i = 0; i < input.length; i++) {
		//console.log("input: "+ input[i]+ " output: " + expectResult[i] )
		testNotPrice(input[i], expectResult[i]);
	}
});

function testNotPrice(input, expectedOutput) {
	test('test not Price', () => {
		expect(Validation.isNotPrice(input)).toStrictEqual(expectedOutput)
	});
}

//test is Not Numberic ID
describe("test Not Numeric",()=>{
	let input = [-1, "test", ' ', undefined, null,12 ,12.3, -12.234];
	let expectResult = [true, true,true,true, true ,false, true,true ];
	for (let i = 0; i < input.length; i++) {
		testisNotNumericID(input[i], expectResult[i]);
	}
});

function testisNotNumericID(input, expectedOutput) {
	test('test Not Numeric', () => {
		expect(Validation.isNotNumericID(input)).toStrictEqual(expectedOutput)
	});
}


//test isNotDigitStringID
describe("test isNotDigitStringID",()=>{
	let input = [-1, "test", "1234.egwrg", "12345", 0 ];
	let expectResult = [true,true,true,false,true];
	for (let i = 0; i < input.length; i++) {
		testisNotDigitStringID(input[i], input[i].toString().length, expectResult[i] );
	}
	testisNotDigitStringID("123456",4,true)
});

function testisNotDigitStringID(input1,input2, expectedOutput) {
	test('isNotDigitStringID', () => {
		expect(Validation.isNotDigitStringID(input1,input2)).toStrictEqual(expectedOutput)
	});
}

//test dateIsValidOrNull
describe("test Validation.dateIsValidOrNull",()=> {
	let input = ["2021/05/06 02:22","2021-05-06 23:16","2021/05/06",undefined,null];
	let expectResult = [true,false,true,true,true];
	for (let i = 0; i < input.length; i++) {
		testDateIsValidOrNull(input[i], expectResult[i]);
	}
});

function testDateIsValidOrNull(input, expectedOutput) {
	test('test dateIsValidOrNull function', () => {
		expect(Validation.dateIsValidOrNull(input)).toStrictEqual(expectedOutput)
	});
}

//test dateIsValid
describe("test Validation.dateIsValid",()=> {
	let input = ["2021/05/06 02:26","twentytwenttwo","2021/05/06",20210506,undefined];
	let expectResult = [true,false,true,false,false];
	for (let i = 0; i < input.length; i++) {
		testDateIsValid(input[i], expectResult[i]);
	}
});

function testDateIsValid (input, expectedOutput) {
	test('test dateIsValid function', () => {
		expect(Validation.dateIsValid(input)).toStrictEqual(expectedOutput)
	});
}

//test isInThePast
describe("test Validation.isInThePast",()=> {
	let input = ["2022/04/20","2022/07/21"];
	let expectResult = [true,false];
	for (let i = 0; i < input.length; i++) {
		testIsInThePast(input[i], expectResult[i]);
	}
});

function testIsInThePast (input, expectedOutput) {
	test('test isInThePast function', () => {
		expect(Validation.isInThePast(input)).toStrictEqual(expectedOutput)
	});
}

//test isValidInThePastOrNull
describe("test Validation.iisValidInThePastOrNull",()=> {
	let input = ["2022/04/20","2022/07/21",null,"2022-04-21",undefined];
	let expectResult = [true,false,true,false,false];
	for (let i = 0; i < input.length; i++) {
		testIsValidInThePastOrNull(input[i], expectResult[i]);
	}
});

function testIsValidInThePastOrNull(input, expectedOutput) {
	test('test  isValidInThePastOrNull function', () => {
		expect(Validation.isValidInThePastOrNull(input)).toStrictEqual(expectedOutput)
	});
}


//test isNotBoolean
describe("test Validation.isNotBoolean",()=> {
	let input = [true,false,1,"true",""];
	let expectResult = [false, false, true, true, true];
	for (let i = 0; i < input.length; i++) {
		testIsNotBoolean(input[i], expectResult[i]);
	}
});

function testIsNotBoolean(input, expectedOutput) {
	test('test isNotBoolean function', () => {
		expect(Validation.isNotBoolean(input)).toStrictEqual(expectedOutput)
	});
}

//test notValidEmail
describe("test Validation.notValidEmail",()=> {
	let input = ["alexyouboom@gmail.com", "fayouisfayo@outlook.com", "www.polito.it", 1234567, "wutttt"];
	let expectResult = [false, false, true, true, true];
	for (let i = 0; i < input.length; i++) {
		testNotValidEmail(input[i], expectResult[i]);
	}
});

function testNotValidEmail(input, expectedOutput) {
	test('test not valid email function', () => {
		expect(Validation.notValidEmail(input)).toStrictEqual(expectedOutput)
	});
}

describe("test position id",()=> {
	let input = [
		{asile: "1234", row: "1234", col: "1234", id: "1234"},
		{asile: "1234", row: "1234", col: "1234", id: ""},
		{asile: "1234", row: "1234", col: "1234", id: "123456790123"},
		{asile: "1234", row: "1234", col: "1234", id: "123412341234"}
	];
	let expectResult = [false, false, false, false, true];
	for (let i = 0; i < input.length; i++) {
		testIsValidPositionID(input[i], expectResult[i]);
	}
});

function testIsValidPositionID(input, expectedOutput) {
	test('test position id is valid', () => {
		expect(Position.positionIdIsValid(
			input.aisle,
			input.row,
			input.col,
			input.id
		)).toStrictEqual(expectedOutput)
	});
}

