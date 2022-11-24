const db = require('./DBInit');

class DBOperations{

    constructor() {}
    fromDB(sql, args){
        return new Promise((resolve, reject) => {
            db.all(sql, args, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });

        });

    }

    intoDB(sql, args){
        return new Promise((resolve,reject)=>{
            db.run(sql, args, function (err) {
                if (err)
                  reject(err);
                else{
                  //if(this.changes===0) reject(new Error("Insertion in DB failed"));
                  resolve(this);
                }
            });

        });
    }

    deleteFromDB(sql, args){
        return new Promise((resolve,reject)=>{
            db.run(sql, args, function (err) {
                if (err)
                  reject(err);
                else{
                  resolve(this);
                }
            });

        });
    }


}

module.exports = DBOperations;
