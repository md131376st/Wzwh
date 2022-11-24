const UserDAO = require("../../DAO/UserDAO");
const TestUtility = require("../../Modules/testUtility");

describe("test User DAO", () => {
  beforeAll(async () => {
    await new TestUtility().deleteData("user");
  });

  afterAll(async () => {
    await new TestUtility().deleteData("user");
  });

  test("delete user from db", async () => {
    let user = {name:"a", surname:"b", email:"c", type:"d"};
    await new UserDAO().createNewUserIntoDb(user, "1234");
    await new UserDAO().deleteUserByUsernameAndTypeIntoDB("c","d");
    const res = await new UserDAO().getAllUsersFromDB('ALL');
    expect(res.length).toStrictEqual(0);
  });
});

