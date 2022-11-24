const DBOperations = require("./DAOManager");

const db = new DBOperations();

class UserDAO {

	async getAllUsersFromDB(type) {
		let sql;

		switch (type) {
			case 'ALL':
				sql = 'SELECT * FROM user WHERE type <> "manager"';
				break;

			case 'SUPPLIERS':
				sql = 'SELECT * FROM user WHERE type = "supplier"';
				break;

		}

		return await db.fromDB(sql, []);
	}

	async createNewUserIntoDb(user, password) {

		const sql = 'INSERT INTO user (name, surname, email, type, password) \
                        VALUES (?,?,?,?,?)'

		const args = [user.name, user.surname, user.email, user.type, password];

		let res = await db.intoDB(sql, args);
		return res.lastID;
	}

	async getUserByUsernameAndType(username, type) {
		const sql = 'SELECT * FROM user WHERE email = ? and type = ?';
		const args = [username, type];

		return await db.fromDB(sql, args);
	}

	async modifyTypeIntoDb(username, newType, oldType) {
		const sql = 'UPDATE user SET type=? WHERE email=? and type = ?'
		const args = [newType, username, oldType];

		let res = await db.intoDB(sql, args);
		return res.lastID;
	}

	async deleteUserByUsernameAndTypeIntoDB(username, type) {
		const sql = 'DELETE FROM user WHERE email = ? and type = ?';
		const args = [username, type];

		let res = await db.deleteFromDB(sql, args);
		return res.lastID;
	}


}


module.exports = UserDAO;
