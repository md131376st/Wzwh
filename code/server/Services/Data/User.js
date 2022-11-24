const Validation = require('../../Modules/Validation')

class User {
  id;
  name;
  surname;
  email;
  type;
  password;

  constructor() { }

  fromDB(rawUser) {
    this.id = rawUser.id;
    this.name = rawUser.name;
    this.surname = rawUser.surname;
    this.email = rawUser.email;
    this.type = rawUser.type;
    this.password = rawUser.password;

    return this;
  }

  fromAPI(rawUser) {
    if (Validation.emptyString(rawUser.name)) throw new Error("Name not valid");

    if (Validation.emptyString(rawUser.surname)) throw new Error("Surname not valid");

    User.checkUsername(rawUser.username);
   
    if (!User.typeIsValid(rawUser.type)) throw new Error("Type not valid for create");

    if (Validation.emptyString(rawUser.password) || rawUser.password.length < 8) throw new Error("Password not valid");

    this.name = rawUser.name;
    this.surname = rawUser.surname;
    this.email = rawUser.username;
    this.type = rawUser.type;
    this.password = rawUser.password;

    return this;
  }

  fromAPILogin(rawUser) {

    User.checkUsername(rawUser.username);
    if (Validation.emptyString(rawUser.password) || rawUser.password < 8) throw new Error("Password not valid");

    this.email = rawUser.username;
    this.password = rawUser.password;
    return this;
  }

  intoDBFormat() {
    return {
      name: this.name,
      surname: this.surname,
      email: this.email,
      type: this.type,
      password: this.password
    }
  }

  intoAPIFormat(filter) {
    let res = {
      id: this.id,
      name: this.name,
      surname: this.surname
    }
    if (filter === "INFO")
      res.username = this.email
    else
      res.email = this.email
    if (filter !== "SUPPLIERS")
      res.type = this.type;
    return res;

  }

  static checkUsername(username){
    if (Validation.notValidEmail(username)) throw new Error("Email not valid");
  }


  static typeIsValid(type) {
    return (
      typeof type === "string" && (
        type === "customer" ||
        type === "qualityEmployee" ||
        type === "clerk" ||
        type === "deliveryEmployee" ||
        type === "supplier")
    )
  }

  static checkId(id){
    if (Validation.isNotNumericID(id))
      throw new Error("Supplier id "+id+" is not valid")
  }
}

module.exports = User;
