const db = require('./DBInit');

class DBTransactions{

    beginTransaction() {
        return new Promise((resolve, reject) => {
            const sql = 'begin transaction';

            db.run(sql, (err) => {
                if (err)
                    reject(err);
                else
                    resolve(this);
            });
        });
    }

    commitTransaction() {
        return new Promise((resolve, reject) => {
            const sql = 'commit';

            db.run(sql, (err) => {
                if (err)
                    reject(err);
                else
                    resolve(this);
            });
        });
    }

    rollbackTransaction() {
        return new Promise((resolve, reject) => {
            const sql = 'rollback';

            db.run(sql, (err) => {
                if (err)
                    reject(err);
                else
                    resolve(this);
            });
        });
    }

}

module.exports = DBTransactions;