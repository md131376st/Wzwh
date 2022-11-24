# Integration and API Test Report

# Contents

- [Dependency graph](#dependencyGraph)

- [Integration approach](#integration)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

![covarage](deliverables/images/test/dependency.jpeg)
     
# Integration approach
Integration was done in a bottom up approach: we started with the unit-testing, where we tested all the function of the DAO classes that interact with the DB and all the method of the validation class which task is to validate all the fields of the HTTP request body (these test are documented in UnitTestReport). Subsequently because of limited time and since the functions of the highest level (routes) are limited to calling functions of the core services level, we decided to merge integration tests and api tests. So we tested all routes in the API and consequently verified that the interaction between the various layers of the application was working. Finally, we performed the simulation of some of the most interesting scenarios to verify their proper functioning. 
    
#  Tests

## Step 1
| Classes | Jest test cases |
|--|--|
| Validation | unit_test/Moduletest/valiation.test.js |


## Step 2
| Classes  |Jest test cases |
|--|--|
| InternalOrderDAO | unit_test/DAOtest/InternalOrderDAO.test.js |
| ItemDAO | unit_test/DAOtest/ItemDAO.test.js |
| PositionDAO | unit_test/DAOtest/PositionDAO.test.js |
| RestockOrderDAO | unit_test/DAOtest/RestockOrderDAO.test.js |
| SkuDAO | unit_test/DAOtest/SkuDAO.test.js |
| SkuItemDAO | unit_test/DAOtest/SkuItemDAO.test.js |
| TestDescriptorDAO | unit_test/DAOtest/TestDescriptorDAO.test.js |
| TestResulDAO | unit_test/DAOtest/TestResulDAO.test.js|
| UserDAO | unit_test/DAOtest/UserDAO.test.js |

![unit](deliverables/images/test/unit.png)

## Step 3

As explained before, integration test and API test are merged, so the step 3 is described in the next section

![unit](deliverables/images/test/api.png)


# API testing - Scenarios

### Coverage of Scenarios and FR


| Scenario ID | FR covered | Mocha  Test(s) | 
| ----------- | ------------------------------- | ------------------------------------------ | 
| 1-1         |  FR2.1                              | code/test/testSkuRouter.js|             
| 1-2         |  FR2.1, FR2.4, FR3.1.3, FR2.3                             | code/test/testSkuRouter.js, code/test/testPositionRouter.js            |             
| 1-3         |  FR2.1, FR2.4, FR2.3                               | code/test/testSkuRouter.js            |             
| 2-1         |  FR3.1.1                               | code/test/testPositionRouter.js             |             
| 2-2         |  FR3.1.1, FR3.1.3                               | code/test/testPositionRouter.js            |             
| 2-3         |  FR3.1.4, FR3.1.3                               | code/test/testPositionRouter.js            |
| 2-4         |   FR3.1.4, FR3.1.3                              | code/test/testPositionRouter.js            |             
| 2-5         |   FR3.1.2, FR3.1.3                              | code/test/testPositionRouter.js            |             
| 3-1         |   FR5.1, FR5.2, FR5.3, FR5.5, FR5.6                              | code/test/testRestockOrderRouter.js, code/test/testSkuRouter.js, code/test/testUserRouter.js            |
| 3-2         |  FR5.1, FR5.2, FR5.3, FR5.5, FR5.6                                | code/test/testRestockOrderRouter.js, code/test/testSkuRouter.js, code/test/testUserRouter.js           |             
| 4-1         |  FR1.1, FR1.5                               | code/test/testUserRouter.js            |             
| 4-2         |   FR1.1, FR1.4, FR1.5                             | code/test/testUserRouter.js            |
| 4-3         |    FR1.2                             | code/test/testUserRouter.js            |             
| 5-1-1       |     FR5.8.1, FR5.8.3                            | code/test/testRestockOrderRouter.js, code/test/testSkuItemRouter.js    |             
| 5-2-1       |    FR5.7, FR5.8.2                             | code/test/testRestockOrderRouter.js, code/test/testSkuItemRouter.js, code/test/testTestResultRouter.js, code/test/testDescriptorRouter.js            |             
| 5-2-2       |   FR5.7, FR5.8.2                                 | code/test/testRestockOrderRouter.js, code/test/testSkuItemRouter.js, code/test/testTestResultRouter.js, code/test/testDescriptorRouter.js             |
| 5-2-3       |      FR5.7, FR5.8.2                              | code/test/testRestockOrderRouter.js, code/test/testSkuItemRouter.js, code/test/testTestResultRouter.js, code/test/testDescriptorRouter.js             |             
| 5-3-1       |     FR5.12, FR3.1.4                            | code/test/testRestockOrderRouter.js, code/test/testSkuItemRouter.js, code/test/testPositionRouter.js           |    FR5.7         
| 5-3-2       |        FR5.7                         | code/test/testRestockOrderRouter.js, code/test/testSkuItemRouter.js, code/test/testResultRouter.js           |
| 5-3-3       |       FR5.7                           | code/test/testRestockOrderRouter.js, code/test/testSkuItemRouter.js, code/test/testResultRouter.js, code/test/testSkuRouter.js, code/test/testPositionRouter.js            |             
| 6-1         |    FR5.10, FR5.11, FR5.12                             | code/test/testReturnOrderRouter.js, code/test/testSkuItemRouter.js, code/test/testTestResultRouter.js          |             
| 6-2         |   FR5.10, FR5.11, FR5.12                                | code/test/testReturnOrderRouter.js, code/test/testSkuItemRouter.js, code/test/testSkuRouter.js, code/test/testPositionRouter.js           |             
| 7-1         |       FR1.5                          | code/test/testUserRouter.js           |             
| 7-2         |       FR1.5                          | code/test/testUserRouter.js            |             
| 9-1         |        FR6.1, FR6.2, FR6.3, FR6.6                         | code/test/testInternalOrderRouter.js, code/test/testSkuRouter.js, code/test/testPositionRouter.js              |             
| 9-2         |       FR6.1, FR6.2, FR6.3, FR6.6                               | code/test/testInternalOrderRouter.js, code/test/testSkuRouter.js, code/test/testPositionRouter.js            |             
| 9-3         |     FR6.1, FR6.2, FR6.3, FR6.6                                 | code/test/testInternalOrderRouter.js, code/test/testSkuRouter.js, code/test/testPositionRouter.js            |             
| 10-1        |           FR6.1, FR6.2, FR6.3, FR6.6                           | code/test/testInternalOrderRouter.js, code/test/testSkuItemRouter.js          |    
| 11-1        |         FR7                        | code/test/testItemRouter.js            |             
| 11-2        |            FR7                     | code/test/testItemRouter.js            |             
| 12-1        |           FR3.2.1, FR3.2.2                      | code/test/testTestDescriptorRouter.js            |             
| 12-2        |              FR3.2.1, FR3.2.2                   | code/test/testTestDescriptorRouter.js            |             
| 12-3        |                 FR3.2.3                | code/test/testTestDescriptorRouter.js            |    


# Coverage of Non Functional Requirements

### 

| Non Functional Requirement | Test name |
| -------------------------- | --------- |
| NFR4                           |   testIsValidPositionID() code/unit_test/Modulestest/validation.test.js        |
| NFR5                           |   testisNotNumericID() code/unit_test/Modulestest/validation.test.js        |
| NFR6                           |   testisNotDigitStringID() code/unit_test/Modulestest/validation.test.js        |
| NFR9                           |   testDateIsValid() code/unit_test/Modulestest/validation.test.js        |


