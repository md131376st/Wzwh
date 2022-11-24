Date:
 
Version:
 
# Contents
 
- [Black Box Unit Tests](#black-box-unit-tests)
 
- [White Box Unit Tests](#white-box-unit-tests)
 
# Black Box Unit Tests
 
 
### **Validation - emptyString**
 
**Criteria for emptyString:**
 
- Well formed string
 
**Predicates for method emptyString:**
 
| Criteria           | Predicate              |
| ------------------ | ---------------------- |
| Well formed string | wfs                    |
|                    | empty string           |
|                    | string has only spaces |
|                    | undefined              |
|                    | null                   |
|                    | not string             |
 
**Combination of predicates**:
 
| Well formed string     | True / False | Description of the test case      | Jest test case  |
| ---------------------- | ------------ | --------------------------------- | --------------- |
| wfs                    | False        | Validation.emptyString("abc")     | testEmptyString |
| empty string           | True         | Validation.emptyString("")        | testEmptyString |
| string has only spaces | True         | Validation.emptyString(" ")       | testEmptyString |
| undefined              | True         | Validation.emptyString(undefined) | testEmptyString |
| null                   | True         | Validation.emptyString(null)      | testEmptyString |
| not string             | True         | Validation.emptyString("  ")      | testEmptyString |
 
**Criteria for negativeOrZeroNumber:**
 
- wf positive number
 
**Predicates for method negativeOrZeroNumber:**
 
| Criteria           | Predicate       |
| ------------------ | --------------- |
| wf positive number | negative number |
|                    | Positive number |
|                    | not wfn         |
|                    | null            |
|                    | undefined       |
 
**Boundaries**:
 
| Criteria           | Boundary values |
| ------------------ | --------------- |
| wf positive number | max positive    |
|                    | 0               |
|                    | min negative    |
 
**Combination of predicates**:
 
| wf positive number | True / False | Description of the test case                      | Jest test case           |
| ------------------ | ------------ | ------------------------------------------------- | ------------------------ |
| negative number    | True         | Validation.negativeOrZeroNumber(-1)               | testnegativeOrZeroNumber |
| positive number    | False        | Validation.negativeOrZeroNumber(12)               | testnegativeOrZeroNumber |
| not wfn            | True         | Validation.negativeOrZeroNumber("32")             | testnegativeOrZeroNumber |
| undefined          | True         | Validation.negativeOrZeroNumber(undefined)        | testnegativeOrZeroNumber |
| null               | True         | Validation.negativeOrZeroNumber(null)             | testnegativeOrZeroNumber |
| 0                  | True         | Validation.negativeOrZeroNumber(0)                | testnegativeOrZeroNumber |
| min_neg            | True         | Validation.negativeOrZeroNumber(Number.MAX_VALUE) | testnegativeOrZeroNumber |
| max_pos            | False        | Validation.negativeOrZeroNumber(Number.MIN_SAFE_INTEGER) | testnegativeOrZeroNumber |
 
 
**Criteria for negativeOrZeroNumber:**
 
- wf positive number
 
**Predicates for method negativeNumber:**
 
| Criteria           | Predicate       |
| ------------------ | --------------- |
| wf positive number | negative number |
|                    | Positive number |
|                    | not wfn         |
|                    | null            |
|                    | undefined       |
 
**Boundaries**:
 
| Criteria           | Boundary values |
| ------------------ | --------------- |
| wf positive number | max_pos         |
|                    | 0               |
|                    | min_neg         |
 
 
**Combination of predicates**:
 
| wf positive number | True / False | Description of the test case                | Jest test case     |
| ------------------ | ------------ | ------------------------------------------- | ------------------ |
| negative number    | True         | Validation.negativeNumber(-1)               | testnegativeNumber |
| positive number    | False        | Validation.negativeNumber(12)               | testnegativeNumber |
| not wfn            | True         | Validation.negativeNumber("32")             | testnegativeNumber |
| undefined          | True         | Validation.negativeNumber(undefined)        | testnegativeNumber |
| null               | True         | Validation.negativeNumber(null)             | testnegativeNumber |
| 0                  | False        | Validation.negativeNumber(0)                | testnegativeNumber |
| undefined          | True         | Validation.negativeNumber(undefined)        | testnegativeNumber |
| min_neg            | True         | Validation.negativeNumber(Number.MAX_VALUE) | testnegativeNumber |
| max_pos            | False        | Validation.negativeNumber(Number.MIN_SAFE_INTEGER) | testnegativeNumber |
 
**Criteria for countDecimal:**
 
- wfn
- decimal digits
 
**Predicates for method countDecimal:**
 
| Criteria       | Predicate          |
| -------------- | ------------------ |
| wfn            | yes                |
|                | no                 |
| decimal digits | integer numbers    |
|                | decimal digits |
 
**Boundaries**:
 
| Criteria       | Boundary values |
| -------------- | --------------- |
| decimal digits | 16 digits       |
 
 
**Combination of predicates**:
 
| wfn | decimal digits     | result                      | Description of the test case               | Jest test case   |
| --- | ------------------ | --------------------------- | ------------------------------------------ | ---------------- |
| yes | integer numbers    | 0                           | Validation.countDecimal(12)                | testCountDecimal |
|     | decimal digits | number of decimal digits | Validation.countDecimal(12.3)              | testCountDecimal |
|     | 16 digits          | number of decimal digits | Validation.countDecimal(12.34567890123456) | testCountDecimal |
| no  | not meaningfull    | -1                          | Validation.countDecimal("hi")              | testCountDecimal |
 
**Criteria for isNotNumericID:**
 
- wf number
- integer
- positive
 
 
 
**Predicates for method isNotNumericID:**
 
| Criteria   | Predicate |
| ---------- | --------- |
| wf  number | yes       |
|            | no        |
| positive   | yes       |
|            | no        |
| integer    | yes       |
|            | no        |
 
**Boundaries**:
 
| Criteria  | Boundary values |
| --------- | --------------- |
| wf number | max_pos         |
|           | 0               |
|           | min_neg         |
 
**Combination of predicates**:
 
| wf number | integer        | positive       | False/True | Description of the test case                       | Jest test case     |
| --------- | -------------- | -------------- | ---------- | -------------------------------------------------- | ------------------ |
| yes       | yes            | yes            | False      | Validation.isNotNumericID(12)                      | testisNotNumericID |
| yes       | yes            | yes            | False      | Validation.isNotNumericID(Number.MAX_VALUE)        | testisNotNumericID |
| yes       | yes            | yes            | True       | Validation.isNotNumericID(0)                       | testisNotNumericID |
| yes       | yes            | no             | True       | Validation.isNotNumericID(Number.MIN_SAFE_INTEGER) | testisNotNumericID |
| yes       | yes            | no             | True       | Validation.isNotNumericID(-1)                      | testisNotNumericID |
| yes       | no             | yes            | True       | Validation.isNotNumericID(12.3)                    | testisNotNumericID |
| yes       | no             | no             | True       | Validation.isNotNumericID(-12.234)                 | testisNotNumericID |
| no        | not meaningful | not meaningful | True       | Validation.isNotNumericID("sting")                 | testisNotNumericID |
 
 
**Criteria for isNotDigitStringID:**
 
- only digit string
- correct string length
 
 
**Predicates for method isNotDigitStringID:**
 
| Criteria              | Predicate    |
| --------------------- | ------------ |
| only digit string     | yes          |
|                       | no           |
|                       | not a string |
| correct string length | yes          |
|                       | no           |
 
**Combination of predicates**:
 
| only digit string | correct string length | False/True | Description of the test case | Jest test case |
| ----------------- | --------------------- | ---------- | ---------------------------- | -------------- |
| yes               | yes                   | False      | Validation.isNotDigitStringID("12345",5)   | testisNotDigitStringID |
| not a string      | yes                   | True       | Validation.isNotDigitStringID(12345,5)     | testisNotDigitStringID |
| no                | yes                   | True       | Validation.isNotDigitStringID("string5",7) | testisNotDigitStringID |
| yes               | no                    | True       | Validation.isNotDigitStringID("12345",1)   | testisNotDigitStringID |
| not a string      | no                    | True       | Validation.isNotDigitStringID(12345,1)     | testisNotDigitStringID |
| no                | no                    | True       | Validation.isNotDigitStringID("string5",1) | testisNotDigitStringID |

 
**Criteria for isNotPrice:**
 
- wfn
- decimal digit
 
**Predicates for method isNotPrice:**
 
| Criteria       | Predicate       |
| -------------- | --------------- |
| wfn            | yes             |
|                | no              |
| decimal digits | integer numbers |
|                | < 2             |
|                | > 2             |
|                | = 2             |
 
| Criteria       | Boundary values |
| -------------- | --------------- |
| decimal digits | 16 digits       |
 
 
 
**Combination of predicates**:
 
| wfn | decimal digits  | result                      | True/False                                 | Jest test case   |
| --- | --------------- | --------------------------- | ------------------------------------------ | ---------------- |
| yes | integer numbers | True                        | Validation.countDecimal(12)                | testCountDecimal |
|     | < 2             | true                        | Validation.countDecimal(12.3)              | testCountDecimal |
|     | > 2             | false                       | Validation.countDecimal(12.345)            | testCountDecimal |
|     | = 2             | true                        | Validation.countDecimal(12.34)             | testCountDecimal |
|     | 16 digits       | false | Validation.countDecimal(12.34567890123456) | testCountDecimal |
| no  | not meaningfull | false                       | Validation.countDecimal("hi")              | testCountDecimal |
 
 
**Criteria for isNotBoolean:**
 
- boolean value
 
**Predicates for method isNotBoolean:**
 
| Criteria    | Predicate    |
|-------------|--------------|
| boolean value | false        |
|               | true         |
|               | integer number |
|               | string |
|               | null |
|               | undefined |
 
**Combination of predicates**:
 
| boolean value | False/True | Description of the test case    | Jest test case   |
|--------------|------------|---------------------------------|------------------|
| true         | False      | Validation.isNotBoolean(true)     | testIsNotBoolean |                          
| false        | False      | Validation.isNotBoolean(false)    | testIsNotBoolean | 
| integer number | True       | Validation.isNotBoolean(1)      | testIsNotBoolean | 
| string         | Ture       | Validation.isNotBoolean("true") | testIsNotBoolean | 
| null           | True       | Validation.isNotBoolean(null)   | testIsNotBoolean |
| undefined      | True       | Validation.isNotBoolean()       | testIsNotBoolean | 
 
 
**Criteria for notValidEmail:**
 
- wf email
 
**Predicates for method notValidEmail:**
 
| Criteria    | Predicate           |
|-------------|---------------------|
| wf email    | valid email address |
|             | empty email         |
|             | email without @     |
|             | email without domain  |
|             | null                |
|             | undefined           |
 
 
**Combination of predicates**:
 
| wf email              | False/True | Description of the test case                        | Jest test case    |
|---------------------------|------------|-----------------------------------------------------|-------------------|
| valid email addres        | False      | Validation.notValidEmail("alexyouboom@gmail.com")   | testNotValidEmail |                        
| empty email               | True       | Validation.notValidEmail("")                        | testNotValidEmail | 
| email without @           | True       | Validation.notValidEmail("www.polito.it")           | testNotValidEmail | 
| email without domain      | True       | Validation.notValidEmail("www.polito@gmail")        | testNotValidEmail |
| null                      | True       | Validation.notValidEmail(null)                      | testNotValidEmail |
| undefined                 | True       | Validation.notValidEmail()                          | testNotValidEmail |
 
# White Box Unit Tests
 
### Test cases definition
 
#### InternalOrderDAO function test
 
| Unit name                                                     | Jest test case                                               |
| ------------------------------------------------------------- | ------------------------------------------------------------ |
| createInternalOrder(internalOrder);                           | InternalOrderDAO.test.js : 'createInternalOrder'             |
| getInternalOrdersFromDB(filter, id)                           | InternalOrderDAO.test.js : 'getAccepted'                     |
| addSkuItemToInternalOrderIntoDB(internalOrderId, rfid, skuId) | InternalOrderDAO.test.js : 'addSkuItemToInternalOrderIntoDB' |
| getInternalOrdersFromDB(filter, id)                           | InternalOrderDAO.test.js : 'getIssued'                       |
| deleteInternalOrderByIdIntoDB(id)                             | InternalOrderDAO.test.js : 'removeInternalOrderFromDB'       |
 
 
#### ItemDAO function test
 
| Unit name              | Jest test case                               |
| ---------------------- | -------------------------------------------- |
| createItemIntoDB(item) | itemDAO.test.js : 'create new item'          |
| deleteData('item')     | itemDAO.test.js : 'delete all items from db' |
 
#### PositionDAO function test
 
| Unit name                          | Jest test case                                  |
| ---------------------------------- | ----------------------------------------------- |
| createNewPositionIntoDb(position)  | PositionDAO.test.js : 'create a new position'   |
| modifyPositionIntoDB(position, id) | PositionDAO.test.js : modify a position         |
| getPositionById(id)                | PositionDAO.test.js : 'get a position'          |
| deletePositionByIdIntoDB(id)       | PositionDAO.test.js : 'delete position from db' |
 
#### RestockOrderDAO function test
 
| Unit name                                       | Jest test case                                           |
| ----------------------------------------------- | -------------------------------------------------------- |
| createNewRestockOrderIntoDb(restockOrder)       | RestockOrderDAO.test.js: 'createNewRestockOrderIntoDb'   |
| addSkuItemToRestockOrderIntoDB(skuid, rfid, id) | RestockOrderDAO.test.js : addSkuItemToRestockOrderIntoDB |
| getRestockOrderByIdFromDB(id)                   | RestockOrderDAO.test.js : 'get restock order by id'      |
| addTransportNoteToROIntoDb(id, last_id)         | RestockOrderDAO.test.js : 'add transport note'           |
| deleteRestockOrderByIdIntoDB(id)                | RestockOrderDAO.test.js : 'delete restock order from db' |
 
 
#### SkuDAO function test
 
| Unit name               | Jest test case                            |
| ----------------------- | ----------------------------------------- |
| createNewSkuIntoDB(sku) | skuDAO.test.js: 'create new sku'          |
| deleteData("sku")       | skuDAO.test.js: 'delete all skus from db' |
 
#### SkuItemDAO c
 
| Unit name                       | Jest test case                                        |
| ------------------------------- | ----------------------------------------------------- |
| getSKUItemByRFIDFromDB(rfid)    | skuItemDAO.test.js: 'get a skuItem by RFID'           |
| deleteSKUItemByRFIDIntoDB(rfid) | skuItemDAO.test.js: 'delete a skuItems by id from db' |
 
#### TestDescriptorDAO function test
 
| Unit name                                  | Jest test case                                                  |
| ------------------------------------------ | --------------------------------------------------------------- |
| createTestDescriptorIntoDB(testDescriptor) | TestDescriptorDAO.test.js: 'create a test result'               |
| getAllTestDescriptorFromDB()               | TestDescriptorDAO.test.js: 'get all test results'               |
| getTestDescriptorByIdFromDB(id)            | TestDescriptorDAO.test.js: 'get a test descriptor by id'        |
| deleteTestDescriptorByIdIntoDB(id)         | TestDescriptorDAO.test.js: 'delete a test descriptor by id'     |
| deleteData("testDescriptor")               | TestDescriptorDAO.test.js: 'delete all testDescriptors from db' |
 
#### TestResultDAO function test
 
| Unit name                                                             | Jest test case                                          |
| --------------------------------------------------------------------- | ------------------------------------------------------- |
| modifyTestResultForASkuItemByIdIntoDB(rfid, testResultId, testResult) | TestResultDAO.test.js: 'modify a test result'           |
| delteData("testResult")                                              | TestResultDAO.test.js: 'delete all testResults from db' |
 
#### UserDAO function test
 
| Unit name                                         | Jest test case                          |
| ------------------------------------------------- | --------------------------------------- |
| deleteUserByUsernameAndTypeIntoDB(username, type) | UserDAO.test.js : 'delete user from db' |
 
### Code coverage report
 
![covarage](deliverables/images/test/covarage.jpg)
 


