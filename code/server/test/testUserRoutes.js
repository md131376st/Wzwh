const TestUtility = require("../Modules/testUtility");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

const app = require("../server");
const agent = chai.request.agent(app);

describe("test User api", async () => {
	let user = {
		username: "user1@EzWh.com",
		name: "jonh",
		surname: "smith",
		password: "testpassword",
		type: "customer",
	};
	before(async () => {
		await new TestUtility().deleteData("position");
		await new TestUtility().deleteData("user");
	});
	after(async () => {
		await new TestUtility().deleteData("user");
	})

	newUser(
		201,
		user.username,
		user.name,
		user.surname,
		user.password,
		user.type
	);
	newUser(
		409,
		user.username,
		user.name,
		user.surname,
		user.password,
		user.type
	);
	newUser(422, 43, user.name, user.surname, user.password, user.type);
	newUser(
		422,
		user.username,
		undefined,
		user.surname,
		user.password,
		user.type
	);
	newUser(422, user.username, user.name, "  ", user.password, user.type);
	newUser(422, user.username, user.name, user.surname, "aser", user.type);
	newUser(
		422,
		user.username,
		user.name,
		user.surname,
		user.password,
		"manager"
	);
	newUser(422);
	modifyUser(200, user.username, user.type, "supplier");
	modifyUser(422, "agsg", user.type, "supplier");
	modifyUser(422, user.username, "aaaa", "supplier");
	modifyUser(404, user.username, "clerk", "supplier");
	modifyUser(422, user.username, "manager", "supplier");
	modifyUser(422, user.username, user.type, "manager");
	modifyUser(422, user.username, user.type, "asfed");
	getAllUser(200, user, "supplier");
	getAllSuppliers(200, user);
	deleteUser(204, user.username, "supplier");
	deleteUser(422, user.username, "manager");
	deleteUser(422, "user2@EzWh.com", "manager");
});

function newUser(expectedHTTPStatus, username, name, surname, password, type) {
	it("adding a new User", function (done) {
		let user = {
			username: username,
			name: name,
			surname: surname,
			password: password,
			type: type,
		};
		agent
			.post("/api/newUser")
			.send(user)
			.then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				done();
			})
			.catch(done);
	});
}

function modifyUser(expectedHTTPStatus, username, oldType, newType) {
	it("modify a user", function (done) {
		let body = {
			oldType: oldType,
			newType: newType,
		};
		agent
			.put("/api/users/" + username)
			.send(body)
			.then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				done();
			})
			.catch(done);
	});
}

function getAllUser(expectedHTTPStatus, user, userType) {
	it("all users", function (done) {
		agent
			.get("/api/users/")
			.then(function (r) {
				r.should.have.status(expectedHTTPStatus);
				r.body.should.have.length(1);

				done();
			})
			.catch(done);
	});
}


function getAllSuppliers(expectedHTTPStatus, user) {
	it("all suppliers", function (done) {
		agent
			.get("/api/suppliers/")
			.then(function (r) {
				r.should.have.status(expectedHTTPStatus);
				r.body.should.have.length(1);

				done();
			})
			.catch(done);
	});
}


function deleteUser(expectedHTTPStatus, username, type) {
	it("delete a user", function (done) {
		agent
			.delete("/api/users/" + username + '/' + type)
			.then(function (res) {
				res.should.have.status(expectedHTTPStatus);
				done();
			})
			.catch(done);
	});
}

