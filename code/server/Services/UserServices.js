const UserDAO = require("../DAO/UserDAO");
const User = require("./Data/User");
const Response = require("../Modules/responses");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
let loggedUser;
let logged;

class UserServices {
  async getAllUsers(type) {
    try {
      const userRows = await new UserDAO().getAllUsersFromDB(type);
      let userList = userRows.map((r) => new User().fromDB(r));
      return Response[200](userList.map((u) => u.intoAPIFormat(type)));
    } catch (e) {
      return Response[500](e);
    }
  }

  async getUserInfo(reqBody, type) {
    let loginUser;

    try {
      loginUser = new User().fromAPILogin(reqBody);
    } catch (e) {
      return Response[401](e);
    }

    try {
      const row = await new UserDAO().getUserByUsernameAndType(
        loginUser.email,
        type ? type : ""
      );

      if (row.length === 0)
        return Response[401]("Wrong username and/or password");
        
      let user = new User().fromDB(row[0]);
      await checkpassword(loginUser.password, user.password);

      if (logged) {
        loggedUser = user;
        return Response[200](user.intoAPIFormat());
      } else return { status: 401, error: "Wrong username and/or password" };

    } catch (e) {
      return Response[500](e);
    }
  }

  async createUser(reqBody) {
    let new_u;
    try {
      new_u = new User().fromAPI(reqBody);
    } catch (e) {
      return Response[422](e);
    }

    const user = await new UserDAO().getUserByUsernameAndType(new_u.email, new_u.type);

    if (user.length === 1)
      return Response[409]("User with email: " + new_u.email + " and type: " + new_u.type + " already exists");

    try {
      bcrypt.hash(new_u.password, saltRounds, async function (err, hash) {
        await new UserDAO().createNewUserIntoDb(new_u.intoDBFormat(), hash);
      });

      return Response[201]();
    } catch (e) {
      return Response[503](e);
    }
  }

  async modifyType(username, reqBody) {
    try {
      try {
        User.checkUsername(username);
      } catch (e) {
        return Response[422](e);
      }

      if (
        !User.typeIsValid(reqBody.newType)
      )
        return Response[422]("Type " + reqBody.newType + " not valid");

      if (
        !User.typeIsValid(reqBody.oldType)
      )
        return Response[422]("Type " + reqBody.oldType + " not valid");

      const row = await new UserDAO().getUserByUsernameAndType(
        username,
        reqBody.oldType
      );
      if (row.length == 0)
        return Response[404]("No user associated to username: " + username + " and type: " + reqBody.oldType);

      await new UserDAO().modifyTypeIntoDb(
        username,
        reqBody.newType,
        reqBody.oldType
      );

      return Response[200]();
    } catch (e) {
      return Response[503](e);
    }
  }

  async deleteUserByUsernameAndType(username, type) {
    try {
      User.checkUsername(username);
      if (!User.typeIsValid(type))
        return Response[422]("Type " + type + " not valid");
    } catch (e) {
      return Response[422](e);
    }

    try {
      await new UserDAO().deleteUserByUsernameAndTypeIntoDB(username, type);
      return Response[204]();
    } catch (e) {
      return Response[503](e);
    }
  }

  async logout() {
    loggedUser = undefined;
    logged = false;
    return Response[200]();
  }

  //No real login... emulation for one user only
  async loggedUserInfo() {
    if (loggedUser) {
      return Response[200](loggedUser.intoAPIFormat("INFO"));
    }
    return Response[401]();
  }
}

const checkpassword = (password, hash) => {
  return new Promise((resolve) => {
    bcrypt.compare(password, hash, function (err, result) {
      logged = result;
      resolve();
    });
  });
};

module.exports = UserServices;
