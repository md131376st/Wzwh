# Design Document 


Authors: CHRISTIAN DAMIANO CAGNAZZO, MONA DAVARI, FEDERICO RINAUDI, FAYOU ZHU

Date:   23/05/2022


# Contents

- [High level design](#package-diagram)
- [Low level design](#class-diagram)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)

# Instructions

# Instructions

The design must satisfy the Official Requirements document, notably functional and non functional requirements, and be consistent with the APIs

# High level design 

```plantuml
card card [
API Layer
----
Application Logic Layer
----
Persistence Layer (DB)
]
```

The structure is divided into three layers: "API LAYER", "LOGIC LAYER" and "DB PERSISTENCE LAYER".
API LAYER:
In this level the APIs are defined.
At this level we wait for the LOGIC LAYER functions and use their return value to build the API response.
LOGIC LAYER:
This level is divided into two parts: "SERVER SECTION" and "DATA SECTION"
SERVER SECTION:
In this section we await the functions of the DB PERSISTENCE LAYER and use their return value to implement the logical part of the application and to respond to the LAYER API.
If we need to update the application logic we only need to update this section.
DATA SECTION:
In this section are managed the conversion of the data from the API LAYER and the PERSISTENCE LAYER formats into the LOGIC LAYER format one and vice versa.
This section is accessible only within the LOGIC LAYER and abstract it from other layers.
The MANAGER LAYER receives "raw" objects and uses the constructors of the classes present in this section to transform them into objects conforming to a certain standard, complete and with all the correct fields.
DB PERSISTENCE LAYER:
In this layer is managed the interaction with the DB, here are written all queries, the insertion and the update of thr DB.






# Low level design

![Login](images/requirements/designD.svg)

```plantuml
@startuml
scale 0.2

namespace Modules{
  class Response{

    static 200(res)
    static 201()
    static 204()
    static 401()
    static 404(e)
    static 409(e)
    static 422(e)
    static 500(e)
    static 503(e)
}

class ResultBuilder{
    static sendResult(resIn, resOut)
}

class Validation {

    static emptyString(string)
    static negativeOrZeroNumber(number)
    static negativeNumber(number)
    static countDecimal(value)
    static isNotPrice(value)
    static isNotNumericID(id)
    static isNotDigitStringID(id, length)
    static dateIsValidOrNull(date)
    static dateIsValid(date)
    static isInThePast(rawDate)
    static isValidInThePastOrNull(date)
    static isNotBoolean(field)
    static notValidEmail(email)
}
}

namespace APILayer {
namespace API {

class SkuRoute{
GET /api/skus getAllSKU()
GET /api/skus/:id getSKUByID()
POST /api/sku createSKU()
PUT /api/sku/:id modifySKU()
PUT /api/sku/:id/position modifyPosition()
DELETE /api/skus/:id deleteSKU()
}


class SkuItemRoute{
GET /api/skuitems getAllSKUItems()
GET /api/skuitems/sku/:id getAllSKUItemWithASKUId()
GET /ap/skuitems/:rfid getSKUItemByRFID()
POST /api/skuitem createSKUItem()
PUT /api/skuitems/:rfid modifySKUItem()
DELETE /api/skuitems/:rfid deleteSKUItemByRFID()
}


class PositionRoute{
GET /api/positions getAllPositions()
POST /api/position/:positionID createPosition()
PUT /api/position/:positionID/changeID modifyPositionById()
DELETE /api/position/:positionID deletePositionById()
}

class TestDescriptionRoute{
GET /api/testDescriptors getAllTestDescriptor()
GET /api/testDescriptors/:id getTestDescriptorById()
POST /api/testDescriptor createTestDescriptor()
PUT /api/testDescriptor/:id modifyTestDescriptorById()
DELETE /api/testDescriptor/:id deleteTestDescriptorById()
}

class TestResultRoute{
GET /api/skuitems/:rfid/testResults getAllTestResultForASKUItem()
GET /api/skuitems/:rfid/testResults/:id getAllTestResultForASKUItem()
POST /api/skuitems/testResult createTestResultForASKUItem()
PUT /api/skuitems/:rfid/testResult/:id modifyTestResult()
DELETE /api/skuitems/:rfid/testResult/:id deleteTestResult()
}

class RestockOrderRoute{
GET /api/restockOrders getAllRestockOrder()
GET /api/restockOrdersIssued getAllIssuedRestockOrder()
GET /api/restockOrders/:id getRestockOrderById()
GET /api/restockOrders/:id/returnItems getAllSKUItemsToBeReturned()
POST /api/restockOrder createRestockOrder()
PUT /api/restockOrder/:id modifyRestockOrderState()
PUT /api/restockOrder/:id/skuItems addSKUItemsToRestockOrder()
PUT /api/restockOrder/:id/transportNote addTransportationNote()
DELETE /api/restockOrder/:id deleteRestockOrderById()
}

class ReturnOrderRoute{
GET /api/returnOrders getAllReturnOrders()
GET /api/returnOrders/:id getReturnOrderById()
POST /api/returnOrder createReturnOrder()
DELETE /api/returnOrder/:id deleteReturnOrderById()
}

class InternalOrderRoute{
GET /api/internalOrders getAllInternalOrders()
GET /api/internalOrdersIssued() getAllInternalOrdersIssued()
GET /api/internalOrdersAccepted getAllInternalOrdersAccepted()
GET /api/internalOrders/:id getInternalOrderById()
POST /api/internalOrders createInternalOrder()
PUT /api/internalOrders/:id modifyInternalOrderState()
DELETE /api/internalOrders/:id deleteOrderById()
}

class ItemRoute{
GET /api/items getAllItems()
GET /api/items/:id/:supplierId getItemById()
POST /api/item createItem()
PUT /api/item/:id/:supplierId modifyItem()
DELETE /api/items/:id/:supplierId deleteItemById()
}

class UserRoute{
GET /api/userinfo getUserInfo()
GET /api/suppliers getAllSuppliers()
GET /api/users getAllUsers()
POST /api/newUser createUser()
PUT /api/users/:username modifyRights()
DELETE /api/users/:username/:type deleteUserByUsernameAndType()
}

}
}



namespace ApplicationLogicLayer {

namespace Services{
Class UserServices {
    getAllUsers(type)
    getUserInfo(reqBody, type)
    createUser(reqBody)
    modifyType(username, reqBody)
  deleteUserByUsernameAndType(username, type) 
logout()
checkpassword(password, hash)
    
}

Class SkuServices {
    getAllSKU()
    getSKUByID(Id)
    createSKU(reqBody)
    modifySKU(id, reqBody)
    modifyPosition(id, reqBody)
   deleteSKU(id)
}

Class PositionServices {
    getAllPositions()
    createPosition(reqBody)modifyPositionById(id, reqBody)
modifyPositionId(id, reqBody)
deletePositionById(id)
}

Class TestDescriptorServices {
  getAllTestDescriptor()
  getTestDescriptorById(id)
  createTestDescriptor(rawTestDescriptor)
 modifyTestDescriptorById(id, rawTestDescriptor)  
deleteTestDescriptorById(id)
}
Class SkuItemServices {
    getAllSKUItem()
      async getAllSKUItemWithASkuId(skuId) getSKUItemByRFID(rfid)
createSKUItem(reqBody)
modifySKUItem(rfid, reqBody)
deleteSkuItemByRFID(rfid)
}

Class InternalOrderServices {
    getInternalOrder(rawInternalOrder)
getInternalOrders(filter)
getInternalOrderById(id)
createInternalOrder(rawInternalOrder)
modifyState(id, reqBody)
deleteInternalOrderById(id)
}
 
Class TestResultServices {
 getAllTestResultForASkuItem(rfid)
getTestResultForASkuItemById(testResultId, rfid)
createTestResult(rawTestResult)
modifyTestResultForASkuItemById(rfid, testResultId, rawTestResult)
deleteTestResultById(rfid, testResultId)
}

Class ItemServices {
getAllItems()
getItemById(ID, supplier)
createItem(APIBody)
modifyItem(ID, APIBody, supplier)
deleteItemById(ID, supplier)
}


Class RestockOrderServices {
getRestockOrder(restockOrder)
getReturnProduct(restockOrderId)
getAllRestockOrder(issued)
getAllSkuItemsToBeReturned(id)
getTransportNote(id)
getAllSkuItemForRestockOrder(restockOrderId)
getAllProductsForRestockOrder(restockOrderId)
getAllProductsForReturnOrder(restockOrderId)
getRestockOrderById(id)
createRestockOrder(reqBody)
 modifyState(id, reqBody)
addSkuItemsToRestockOrder(id, reqBody)
addTransportNote(id, reqBody)
deleteRestockOrderById(id)    
}



Class ReturnOrderServices {
    getAllReturnOrders()
getReturnOrderById(id)
createReturnOrder(APIBody)
deleteReturnOrderById(id)
}
}

namespace Data {
class InternalOrder{
id
issueDate
state
customerId
products
FromDB(internalOrder)
assignProductsFromDB(skuRows, skuItemRows)
toDBFormat()
FromAPI(rawInternalOrder)
intoAPIFormat()
setNewState(newState)
static checkNewState(newState)
fromAPIPModify(rawInternalOrder)
static checkId(id)
}

class Item {
id
description
price
skuId
supplierId
fromDB(obj)
fromAPI(obj)
fromAPIModify(obj)
intoAPIFormat()
intoDBFormat()
itemForRestockOrder(item, quantity)
itemForReturnOrder(item)
static checkId(id)
}

class Position {


    positionID
    aisleID
    row
    col
    maxWeight
    maxVolume
    occupiedWeight
    occupiedVolume


    fromApi(obj)
    fromDB(obj) 
    fromAPIModify(obj) 
    intoDBFormat() 
    intoAPIFormat() 
    fromId(newPositionID) 
    setOccupation(volume, weight) 
    static checkId(id) 
}
class ProductWithSkuAndQuantity {
  skuId
  quantity
  price
  description


  fromDB(rawSku)
  fromAPI(rawProduct) 
  intoAPIFormat() 
}

class ProductWithSkuItem {
  skuId
  rfid
  price
  description

  fromDB(rawSku, rfid) 
  fromAPI(rawProduct) 
  intoAPIFormat()
  fromAPIPModify(product)
}

class RestockOrder {
    id
    issueDate
    state
    supplierId
    transportNote
    products
    skuItems
    

    intoAPIFormat(obj, transportNote, skuItems, products)
    fromAPI(obj)
    intoDBFormat()
    fromDB(obj)
    static checkNewState(newState)
    static checkId(id)
    skuItemsFromAPI(skuItems)

}

class ReturnOrder {

	id
	returnDate
	restockOrderId
	products

	fromDB(rawReturnOrder)
	assignProductsFromDB(rawProducts)
	fromAPI(rawReturnOrder)
	intoAPIFormat()
	intoAPIFormatWithID()
	intoDBFormat()
	static checkId(id)
}

class Sku {
  id;
  description;
  volume;
  weight;
  notes;
  position;
  availableQuantity;
  price;
  testDescriptor;


  fromAPI(obj)
  fromDB(obj)
  fromAPIModify(obj)
  intoDBFormat()
  intoAPIFormat() 
  setAvailableQuantity(newQuantity)
  static checkId(id)
}

class SkuItem {
  rfid;
  skuId;
  dateOfStock;
  available;


  fromAPI(rawSkuItem)
  fromDB(rawSkuItem)
  fromAPIModify(rawSkuItem)
  fromDB(rawSkuItem)
  intoDBFormat()
  intoAPIFormat()
  intoAPIFormatWithoutAvailable()
  skuItemForRestockOrderIntoAPIFormat(skuItem)
  newSkuItemForRestockOrder(skuItem)
  static checkId(id) 


}

class TestDescriptor {
  id
  name
  procedureDescription
  skuId

  fromDB(rawTestDescriptor)
  fromAPI(rawTestDescriptor)
  fromAPIModify(obj)
  static checkId(id)
  toDBFormat()
  intoAPIFormat()
}

class TestResult {
  id
  rfid
  date
  result
  testDescriptor

  fromDB(rawTestResult)
  FromAPICreate(rawTestResult)
  FromAPIModify(rawTestResult)
  static checkId(id)
  static validRfid(rfid)
}
class TransportNote{
    id
    shipmentDate

    intoAPIFormat()
    fromDB(obj)
    
}

class User {
  id
  name
  surname
  email
  type
  password

  fromDB(rawUser)
  fromAPI(rawUser)
  fromAPILogin(rawUser)
  intoDBFormat()
  intoAPIFormat(filter)
  static checkUsername(username)
  static typeIsValid(type)
  static checkId(id)
}
InternalOrder --> ProductWithSkuItem
InternalOrder --> ProductWithSkuAndQuantity
InternalOrder --> User
Item --> User
Item --> Sku
ProductWithSkuAndQuantity --> Sku
ProductWithSkuItem --> Sku
ProductWithSkuItem --> SkuItem
RestockOrder --> User
RestockOrder --> ProductWithSkuAndQuantity
RestockOrder --> SkuItem
ReturnOrder --> ProductWithSkuItem
ReturnOrder --> RestockOrder
SkuItem --> Sku
TestDescriptor --> Sku
TestResult --> SkuItem
TestResult --> TestDescriptor 
}
ApplicationLogicLayer.Services --> ApplicationLogicLayer.Data
}

namespace PersistenceLayer {

namespace DAO{

class DBOperations{

    fromDB(sql, args)
    intoDB(sql, args)
    deleteFromDB(sql, args)

}

class DBinit{
 DB
}

class DBTransactions{

    beginTransaction()
    commitTransaction()
    rollbackTransaction()

}

class InternalOrderDAO {
  
  getInternalOrdersFromDB(filter, id)
  createInternalOrder(internalOrder)
  addSkuToInternalOrderIntoDB(internalOrderID, skuID, quantity)
  modifyInternalOrderStateIntoDB(id, state)
  deleteInternalOrderByIdIntoDB(id)
  getAllSkuForInternalOrderFromDB(id)
  addSkuItemToInternalOrderIntoDB(internalOrderId, rfid, skuId)
  getAllSkuItemsForInternalOrderFromDB(internalOrderId)
  deleteData()
}

class ItemDAO {

	async getAllItemsFromDB()
        getItemByIdFromDB(itemId, supplier)
	createItemIntoDB(item)
	supplierSellSku(suplierID, skuID)
        modifyItemIntoDB(itemId, newItem, supplier)
	deleteItemByIdFromDB(itemId, supplier)

}

class PositionDAO {

	getAllPositionFromDB()
	getPositionById(id)
	asycreateNewPositionIntoDb(position)
	modifyPositionIntoDB(position, id)
	modifyPositionIDIntoDb(id, position)
        deletePositionByIdIntoDB(id)
	isPositionAssignedIntoDB(id)


}

class RestockOrderDAO {
    getAllRestockOrderFromDB(issued)
    getTransportNoteFromDB(id)
    getAllSkuItemForRestockOrderFromDB(restockOrderId)
    checkTestResult(skuItemId)
    getAllProductsForRestockOrderFromDB(restockOrderId)
    getRestockOrderByIdFromDB(id)
    createNewRestockOrderIntoDb(restockOrder)
    modifyStateIntoDb(id, state)
    addTransportNoteIntoDb(transportNote)
    addTransportNoteToROIntoDb(id, last_id)
    deleteRestockOrderByIdIntoDB(id)
    addSkuItemToRestockOrderIntoDB(skuid, rfid, id)
    getItemBySkuAndSupplierFromDB(skuId, supplierId)
    addItemToARestockOrder(itemId, roId, quantity)
}

class ReturnOrderDAO {
    getAllReturnOrdersFromDB()
    getReturnOrderByIdFromDB(Id)
    createReturnOrderIntoDB(ReturnOrder)
    deleteReturnOrderByIdFromDB(returnOrderID)
    getAllProductsForAReturnOrderFromDB(returnOrderId)
    addSkuItemToReturnOrderIntoDB(returnOrderId, rfid, skuId)
}

class SkuDAO {
  getAllSkuFromDB()
  getSKUByIDFromDB(Id)
  createNewSkuIntoDB(Sku)
  modifySkuIntoDB(sku, id)
  modifySkuPositionIntoDB(id, positionId)
  deleteSkuByIdIntoDB(id)
}

class SkuItemDAO {

	getAllSkuItemFromDB()
	getAllSkuItemWithASkuIdFromDB(skuId)
	getSKUItemByRFIDFromDB(rfid)
	createSKUItemIntoDB(skuItem)
	modifySKUItemIntoDB(skuItem, rfid)
	deleteSKUItemByRFIDIntoDB(rfid)
}


class TestDescriptorDAO {
  getAllTestDescriptorFromDB()
  getTestDescriptorByIdFromDB(id)
  createTestDescriptorIntoDB(testDescriptor)
  modifyTestDescriptorByIdIntoDB(id, testDescriptor)
  deleteTestDescriptorByIdIntoDB(id)
}

class TestResultDAO {
  
  getAllTestResultForASkuItemFromDB(rfid)
  getTestResultForASkuItemByIdFromDB(testResultId, rfid)
  createTestResultIntoDB(testResult)
  modifyTestResultForASkuItemByIdIntoDB(rfid, testResultId, testResult)
  deleteTestResultByIdIntoDB(rfid, testResultId)
}

class UserDAO {

	getAllUsersFromDB(type)
	createNewUserIntoDb(user, password)
	getUserByUsernameAndType(username, type)
	modifyTypeIntoDb(username, newType, oldType)
	deleteUserByUsernameAndTypeIntoDB(username, type)

}

}
}

class Server{

}

APILayer --> ApplicationLogicLayer.Services
ApplicationLogicLayer.Services --> PersistenceLayer
ApplicationLogicLayer.Data --> Modules.Validation 
ApplicationLogicLayer.Services  -->  Modules.Response  
APILayer --> Modules.ResultBuilder 
APILayer --> Server

@enduml


```






# Verification traceability matrix

| | Modules | API | DBPersistence | UserManager| User | SKUManager|SKU | PositionManager |Position | TestDescriptorManager |Test Descriptor| SKUItemManager|SKUItem | InternalOrderManager|Internal Order | TestResultManager |Test Result| ItemManager |Item | RestockOrderManager|Restock Order | ReturnOrderManager |Return Order|
| ------------- |:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| FR1 |X|X|X|X|X||||||||||||||||||| 
| FR2 |X|X|X|||X|X|||||||||||||||||  
| FR3 |X|X|X|||||X|X|X|X|||||||||||||  
| FR4 |X|X|X|X|X||||||||||||||||||| 
| FR5 |X|X|X|||||||||X|X|||X|X|||X|X|X|X| 
| FR6 |X|X|X|||||||||||X|X||||||||| 
| FR7 |X|X|X|||||||||||||||X|X|||||




# Verification sequence diagrams 

Each time an API is called, it verifies that the user calling the API has the necessary rights.
Since this happens for each API, the sequence will be reported only once, but this procedure will occur at each call.

```plantuml
@startuml
title "Sequence Diagram Scenario generic API called"
participant API
participant UserManager
participant User
participant DBPersistence

API -> UserManager: getUserInfo(username)
UserManager -> DBPersistence: getUserInfoFromDB(username)
DBPersistence -> UserManager: return result
UserManager -> User: User()
User -> UserManager: return user
UserManager -> API: return userRightsList
rnote over API 
Check if user has righs nedeed to call the API 
endrnote
rnote over API 
API is executed
endrnote
@enduml
```

```plantuml
@startuml
title "Sequence Diagram of Scenario 1-1"
actor Manager as M
participant API
participant SKUManager
participant SKU
participant DBPersistence

M ->API: createSKU()
API->SKUManager: createSKU(APIBody)
SKUManager->SKU: SKU()
SKU->SKUManager:return SKU
SKUManager->DBPersistence:createSKUIntoDB(SKU)
DBPersistence->SKUManager: return result
SKUManager->API: return result
API->M: return result
@enduml
```

```plantuml
@startuml
title "Sequence Diagram of Scenario 2-1"
actor Manager as M
participant API
participant PositionManager as PM
participant Position as P
participant DBPersistence as DB

M->API: createPositon()
API->PM: createPosition(Obj APIBody,String )
PM->P: Position()
P->PM: return position
PM->DB:createPositionIntoDB(Obj position)
DB->PM: return result
PM->API:return result
API->M: return result
@enduml
```

```plantuml
@startuml
title "Sequence Diagram of Scenario 2-2"
actor Manager as M
participant API
participant PositionManager as PM
participant Position as P
participant DBPersistence as DB

M->API: modifyPositonByID()
API->PM:modifyPositonByID(String ID,Obj APIBody)
PM->P: Position() 
P -> PM: return position 
PM->DB:modifyPositionIDIntoDB(Obj position)
DB->PM: return result
PM->API:return result
API->M: return result
@enduml
```

```plantuml
@startuml
title "Sequence Diagram of Scenario 2-5"
actor Manager as M
participant API
participant PositionManager as PM
participant DBPersistence as DB

M->API: deletePositon()
API->PM: deletePositionById(positionId)
PM->DB:deletePositionByIDFromDB(positionId)
DB->PM: return result
PM->API:return result
API->M: return result
@enduml
```


```plantuml
@startuml
title "Sequence Diagram of Scenario 3-1"
actor Manager as M
participant API
participant RestockOrderManager as ROM
participant RestockOrder as RO
participant DBPersistence as DB


M->API: createRestockOrder()
API->ROM: createRestockOrder(Obj APIBody)
ROM->RO:RestockOrder()
RO->ROM:return RestockOrder
ROM->DB:createRestockOrderIntoDB(Obj restockOrder)
DB->ROM:return result
ROM->API: return result
API->M: return result
M->API: addSKUItemToRestockOrder()
API->ROM: addSKUItemToRestockOrder(String ID,Obj APIBody)
ROM->DB:addSKUItemToRestockOrderIntoDB(String restockOrderID,List<Obj>SkuItems)
DB->ROM: return result
ROM->API: return result
API->M: return result

@enduml
```

```plantuml
@startuml
title "Sequence Diagram Scenario 4.1"
actor Administrator as U
participant API
participant UserManager
participant User
participant DBPersistence

U->API: createUser()
API-> UserManager:  createUser(Obj APIBody)
UserManager->User:  User()
User->UserManager: return user
UserManager->DBPersistence: createUserIntoDB(user)
DBPersistence-> UserManager: return result
UserManager->API: return result
API -> U: return result
@enduml
```

```plantuml
@startuml
title "Sequence Diagram Scenario 4.2"
actor Administrator as U
participant API
participant UserManager
participant DBPersistence

U->API: modifyRights()
API-> UserManager: modifyRights(username, APIBody)
UserManager->DBPersistence: modifyRightsIntoDB(username, newRights)
DBPersistence-> UserManager: 7: return result
UserManager->API: return result
API -> U: return result
@enduml
```

```plantuml
@startuml
title "Sequence Diagram Scenario 4.3"
actor Administrator as U
participant API
participant UserManager
participant DBPersistence

U->API: deleteUserByUsernameAndType()
API-> UserManager: deleteUserByUsernameAndType(String username, String type)
UserManager->DBPersistence: deleteUserByUsernameAndTypeFromDB(String username, String type)
DBPersistence-> UserManager: 7: return result
UserManager->API: return result
API -> U: return result
@enduml
```

```plantuml
@startuml
title "Sequence Diagram Scenario 5.1.1"
actor Clerk as C
participant API
participant SKUItemManager
participant SKUItem
participant DBPersistence
participant RestockOrderManager

rnote over C 
for each SkuItem in the RestockOrder
endrnote
C->API: createSkuItem() 
API-> SKUItemManager: createSkuItem(APIbody)
SKUItemManager->SKUItem: SKUItem()
SKUItem->SKUItemManager: return SKUItem
SKUItemManager->DBPersistence: createSkuItemIntoDB(SKUItem)
DBPersistence-> SKUItemManager: return result
SKUItemManager-> API: return result
API -> C: return result
C->API: modifyRestockOrderState() 
API->RestockOrderManager: modifyState(id, apibody)
RestockOrderManager->DBPersistence: modifyRestockOrderStateIntoDB(id,newstate)
DBPersistence-> RestockOrderManager: return result
RestockOrderManager->API: return result
API -> C: return result
@enduml
```

```plantuml
@startuml
title "Sequence Diagram Scenario 5.2.1, 5.2.2, 5.2.3"
actor QualityEmployee as Q
participant API
participant TestResultManager
participant TestResult
participant DBPersistence
participant RestockOrderManager

rnote over API 
for each SkuItem in the RestockOrder
endrnote
Q->API: createtestResultForASkuItem() 
API-> TestResultManager: createtestResultForASkuItem(APIbody)
TestResultManager->TestResult: TestResult()
TestResult-> TestResultManager: return testResult
TestResultManager->DBPersistence: createtestResultForASkuItem(testResult)
DBPersistence-> TestResultManager: return result
TestResultManager-> API: return result
API -> Q: return result
Q->API: modifyRestockOrderState() 
API->RestockOrderManager: modifyState(id, apibody)
RestockOrderManager->DBPersistence: modifyRestockOrderStateIntoDB(id,newstate)
DBPersistence-> RestockOrderManager: return result
RestockOrderManager->API: return result
API -> Q: return result
@enduml
```

```plantuml
title "Sequence Diagram Scenario 6.1, 6.2"
actor Manager as M
participant API
participant RestockOrderManager
participant ReturnOrderManager
participant SKUManager
participant SKUItemManager
participant PositionManager
participant DBPersistence

M->API: getAllSKUItemsToBeReturned() 
API->RestockOrderManager: getAllSKUItemsToBeReturned(id) 
RestockOrderManager->DBPersistence: getAllSKUItemsToBeReturned(id)
DBPersistence-> RestockOrderManager: return result
RestockOrderManager->API: return result
API->M: return result

M->API: createReturnOrder()
API->ReturnOrderManager: createReturnOrder(apiBody)
ReturnOrderManager->ReturnOrder: ReturnOrder()
ReturnOrder-> ReturnOrderManager: return returnOrder
ReturnOrderManager->DBPersistence: createReturnOrderIntoDB(returnOrder)
DBPersistence->ReturnOrderManager: return result
ReturnOrderManager->API: return result

rnote over API 
for each SkuItem 
endrnote

API->SKUItemManager: modifySKUItem(id, apiBody)
SKUItemManager->DBPersistence: modifySKUItemIntoDB(id, newSkuItem)
DBPersistence->SKUItemManager: return result
SKUItemManager->API: return result

rnote over API 
Only in scenario 6.2
endrnote

API->SKUManager: modifySKU(id, apiBody)
SKUManager->DBPersistence: modifySKUIntoDB(id, newSku)
DBPersistence->SKUManager: return result
SKUManager->API: return result

API->PositionManager: modifyPositionByID(id, apiBody)
PositionManager->DBPersistence: modifyPositionByIDIntoDB(id, newPosition)
DBPersistence-> PositionManager: return result
PositionManager->API: return result

API->M: return result 
@enduml

```

```plantuml
@startuml
title "Sequence Diagram Scenario 9-1"
actor Customer as C
actor Manager as M
participant API
participant ItemManger
participant InternalOrderManager
participant InternalOrder
Participant SKUManager
participant PositionManger
participant DBPersistence

C->API: getAllItems()
API-> ItemManger: getAllItems()
ItemManger -> DBPersistence: getAllItemsFromDB()
DBPersistence-> ItemManger: return result
ItemManger -> API: return result
API -> C: return result
rnote over C
Costumer add the item it want to order
endrnote
C->API: createInternalOrder()
API-> InternalOrderManager: createInternalOrder()
InternalOrderManager -> InternalOrder : InternalOrder()
InternalOrder -> InternalOrderManager: return internalOrder
rnote over InternalOrderManager
status field of the internal order is set to ISSUED
endrnote
InternalOrderManager -> DBPersistence: createInternalOrderIntoDB()
DBPersistence-> InternalOrderManager: return result
rnote over InternalOrderManager 
for each item in InternalOrder decrese availability and increse positions
endrnote
InternalOrderManager -> SKUManager : ChangeQuantity(NumberChange)
SKUManager -> DBPersistence :ChangeQuantitySKUItemByRFIDFromDB()
DBPersistence -> SKUManager : return result
SKUManager -> InternalOrderManager: return result
InternalOrderManager -> PositionManger : modifyPositionById()
PositionManger -> DBPersistence :modifyPositionByIdIntoDB()
DBPersistence -> PositionManger: return result
PositionManger -> InternalOrderManager: return result 
InternalOrderManager -> API : return result
API -> C: return result
M -> API: getAllInternalOrdersIssued()
API -> InternalOrderManager: getAllInternalOrdersIssued()
InternalOrderManager -> DBPersistence: getAllInternalOrdersIssuedFromDB()
DBPersistence -> InternalOrderManager : return result
InternalOrderManager -> API : return result
API -> M : return result
rnote over M 
Select Internal order
endrnote
 M -> API : modifyInternalOrderState()
API -> InternalOrderManager : modifyState("ACCEPTED")
InternalOrderManager -> InternalOrder: InternalOrder()
InternalOrder -> InternalOrderManager: return internalOrder
rnote over InternalOrderManager
status field of the internal order is set to REFUSED
endrnote
InternalOrderManager -> DBPersistence: modifyInternalOrderIntoDB()
PositionManger -> InternalOrderManager: return result 
InternalOrderManager -> API : return result
API -> M : return result

@enduml
```

```plantuml
@startuml
title "Sequence Diagram Scenario 9-2"
actor Customer as C
actor Manager as M
participant API
participant InternalOrderManager
participant InternalOrder 
Participant SKUManager
participant PositionManger
participant DBPersistence

rnote over C
The procedure of the scenario 
10.2 where the customer 
create an order
and the one where
orders are displayed 
to the manager  
are the same 
as scenario 10.1, so not reported
endrnote
M -> API : modifyInternalOrderState()
API -> InternalOrderManager : modifyState("REFUSED")
InternalOrderManager -> InternalOrder: InternalOrder()
InternalOrder -> InternalOrderManager: return internalOrder
rnote over InternalOrderManager
status field of the internal order is set to REFUSED
endrnote
InternalOrderManager -> DBPersistence: modifyInternalOrderIntoDB()
DBPersistence -> InternalOrderManager: return result 
rnote over InternalOrderManager 
for each item in InternalOrder increase availability and decrease positions
endrnote
InternalOrderManager -> SKUManager : ChangeQuantity(NumberChange)
SKUManager -> DBPersistence :ChangeQuantitySKUItemByRFIDFromDB()
DBPersistence -> SKUManager : return result
SKUManager -> InternalOrderManager: return result
InternalOrderManager -> PositionManger : modifyPositionById()
PositionManger -> DBPersistence :modifyPositionByIdIntoDB()
DBPersistence -> PositionManger: return result
PositionManger -> InternalOrderManager: return result 
InternalOrderManager -> API : return result
API -> M : return result
@enduml
```

```plantuml
@startuml
title "Sequence Diagram Scenario 10.1"
actor Deliver_Employee as D
participant API
participant InternalOrderManager
participant SKUItemManager
participant InternalOrder
participant SKUItem
participant DBPersistence

D->API: getInternalOrderById() 
API-> InternalOrderManager: getInternalOrderbyID(ID)
InternalOrderManager->DBPersistence: getInternalOrderbyID(ID)
DBPersistence -> InternalOrderManager: return result
InternalOrderManager -> InternalOrder: InternalOrder()
InternalOrder -> InternalOrderManager: return internalOrder
InternalOrderManager -> API: return inernalOrder
API -> D: return result
D->API: modifyInternalOrderState() 
API-> InternalOrderManager: modifyInternalOrderState(ID)
InternalOrderManager->DBPersistence: getInternalOrderbyID(ID)
DBPersistence -> InternalOrderManager: return result
InternalOrderManager -> InternalOrder: InternalOrder()
InternalOrder -> InternalOrderManager: return internalOrder

rnote over InternalOrderManager 
for each SkuItem in the InternalOrder
endrnote
InternalOrderManager -> SKUItemManager: modifySkuItemAvailability(String RFID, false)
SKUItem->SKUItemManager: return SKUItem
rnote over SKUItemManager 
SKUitem available field set to false
endrnote
SKUItemManager -> DBPersitence: modifySKUItemIntoDB(SKUItem)
DBPeristence -> SKUItemManager: return result
SKUItemManager -> InternalOrderManager: return result
rnote over InternalOrderManager 
internalOrderstatus set to COMPLETED
endrnote
InternalOrderManager -> DBPersistence: modifyInternalOrderIntoDB(ID, internalOrder)
DBPersistence -> InternalOrderManager: return result
InternalOrderManager -> API: return result
API -> D: return result



@enduml

```

```plantuml
@startuml
title "Sequence Diagram Scenario 11.1"
actor Supplier as S
participant API
participant ItemManager
participant Item
participant DBPersistence

S->API: createItem() 
API-> ItemManager: createItem(APIbody)
ItemManager->Item: Item() 
Item -> ItemManager: return item
ItemManager->DBPersistence: createtestItemIntoDB(testResult)
DBPersistence-> ItemManager: return result
ItemManager-> API: return result
API -> S: return result
@enduml

```

```plantuml
@startuml
title "Sequence Diagram Scenario 11.2"
actor Supplier as S
participant API
participant ItemManager
participant Item
participant DBPersistence


S->API: getItemByID() 
API-> ItemManager: getItemByID(itemID)
ItemManager -> DBPersistence: getItemFromDB(itemID)
DBPersistence -> ItemManager: return result
ItemManager->Item: Item() 
Item -> ItemManager: return item
ItemManager-> API: return item
API -> S: return result
S->API: modifyItem() 
API-> ItemManager: modifyItem(itemID, APIbody)
ItemManager->Item: Item() 
Item -> ItemManager: return item
ItemManager->DBPersistence: modifyItemIntoDB(testResult)
DBPersistence-> ItemManager: return result
ItemManager-> API: return result
API -> S: return result
@enduml

```

```plantuml
@startuml
title "Sequence Diagram Scenario 12.1"
actor Manager as M
participant API
participant TestDescriptorManager
participant TestDescriptor
participant DBPersistence

M->API: createTestDescriptor() 
API-> TestDescriptorManager: createTestDescriptor(APIbody)
TestDescriptorManager->TestDescriptor: TestDescriptor() 
TestDescriptor -> TestDescriptorManager: return testDescriptor
TestDescriptorManager->DBPersistence: createtestTestDescriptorIntoDB(testDescriptor)
DBPersistence-> TestDescriptorManager: return result
TestDescriptorManager-> API: return result
API -> M: return result
@enduml

```

```plantuml
title "Sequence Diagram Scenario 12.2"
actor Manager as M
participant API
participant TestDescriptorManager
participant TestDescriptor
participant DBPersistence


M->API: getTestDescriptorByID() 
API-> TestDescriptorManager: getTestDescriptorByID(testDescriptorID)
TestDescriptorManager -> DBPersistence: getTestDescriptorFromDB(testDescriptorID)
DBPersistence -> TestDescriptorManager: return result
TestDescriptorManager->TestDescriptor: TestDescriptor() 
TestDescriptor -> TestDescriptorManager: return testDescriptor
TestDescriptorManager-> API: return TestDescriptor
API -> M: return result
M->API: modifyTestDescriptorByID() 
API-> TestDescriptorManager: modifyTestDescriptorByID(testDescriptorID, APIbody)
TestDescriptorManager->TestDescriptor: TestDescriptor() 
TestDescriptor -> TestDescriptorManager: return testDescriptor
TestDescriptorManager->DBPersistence: modifyTestDescriptorByIDIntoDB(testDescriptorID, testDescriptor)
DBPersistence-> TestDescriptorManager: return result
TestDescriptorManager-> API: return result
API -> M: return result
@enduml

```

```plantuml
@startuml
title "Sequence Diagram Scenario 12.3"
actor Manager as M
participant API
participant TestDescriptorManager
participant TestDescriptor
participant DBPersistence


M->API: getTestDescriptorByID() 
API-> TestDescriptorManager: getTestDescriptorByID(testDescriptorID)
TestDescriptorManager -> DBPersistence: getTestDescriptorFromDB(testDescriptorID)
DBPersistence -> TestDescriptorManager: return result
TestDescriptorManager->TestDescriptor: TestDescriptor() 
TestDescriptor -> TestDescriptorManager: return testDescriptor
TestDescriptorManager-> API: return TestDescriptor
API -> M: return result
M->API: deleteTestDescriptorByID() 
API-> TestDescriptorManager: deleteTestDescriptorByID(testDescriptorID)
TestDescriptorManager->DBPersistence: deleteTestDescriptorByIDIntoDB(testDescriptorID)
DBPersistence-> TestDescriptorManager: return result
TestDescriptorManager-> API: return result
API -> M: return result
@enduml

```

