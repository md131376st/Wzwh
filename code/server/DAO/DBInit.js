const dbname = "EzWh.db";


const sqlite = require('sqlite3');


const db = new sqlite.Database(dbname, (err) => {
    if (err) throw err;
});


db.serialize(function () {

    db.run("PRAGMA foreign_keys = ON");

    db.run('CREATE TABLE IF NOT EXISTS "position"(\
    "positionID"	TEXT,\
    "aisle"	TEXT,\
    "row"	TEXT,\
    "col"	TEXT,\
    "maxVolume"	INTEGER,\
    "maxWeight"	INTEGER,\
    "occupiedWeight"	INTEGER,\
    "occupiedVolume"	INTEGER,\
    PRIMARY KEY("positionID")\
)');

    db.run('CREATE TABLE IF NOT EXISTS "sku"(\
    "id"	INTEGER,\
    "description"	TEXT,\
    "weight"	NUMERIC,\
    "volume"	NUMERIC,\
    "prices"	NUMERIC,\
    "notes"	TEXT,\
    "position"	TEXT UNIQUE,\
    "availableQuantity"	INTEGER,\
    PRIMARY KEY("id" AUTOINCREMENT),\
    FOREIGN KEY("position") REFERENCES "position"("positionID") on delete set NULL on UPDATE CASCADE\
)');

    db.run('CREATE TABLE IF NOT EXISTS "transportNote"(\
    "id"	INTEGER,\
    "shipmentDate"	TEXT,\
    PRIMARY KEY("id" AUTOINCREMENT)\
)');


    db.run('CREATE TABLE IF NOT EXISTS "user"(\
    "id"	INTEGER,\
    "name"	TEXT,\
    "surname"	TEXT,\
    "email"	TEXT,\
    "type"	TEXT,\
    "password"	TEXT,\
    UNIQUE("email", "type"),\
    PRIMARY KEY("id" AUTOINCREMENT)\
)');

    db.run('CREATE TABLE IF NOT EXISTS "internalOrder"(\
    "id"	INTEGER,\
    "date"	TEXT,\
    "state"	TEXT,\
    "fromCustomer"	INTEGER,\
    PRIMARY KEY("id" AUTOINCREMENT),\
    FOREIGN KEY("fromCustomer") REFERENCES "user"("id") ON DELETE CASCADE\
)');

    db.run('CREATE TABLE IF NOT EXISTS "internalOrderSku"(\
    "internalOrder"	INTEGER,\
    "sku"	INTEGER,\
    "quantity"	INTEGER,\
    PRIMARY KEY("internalOrder", "sku"),\
    FOREIGN KEY("internalOrder") REFERENCES "internalOrder"("id") ON DELETE CASCADE\
)');

    db.run('CREATE TABLE IF NOT EXISTS "item"(\
    "id"	INTEGER,\
    "description"	TEXT,\
    "price"	INTEGER,\
    "sku"	INTEGER,\
    "supplier"	INTEGER,\
    PRIMARY KEY("id", "supplier"),\
    UNIQUE("sku", "supplier"),\
    FOREIGN KEY("sku") REFERENCES "sku"("id") ON DELETE CASCADE,\
    FOREIGN KEY("supplier") REFERENCES "user"("id") ON DELETE CASCADE\
)');

    db.run('CREATE TABLE IF NOT EXISTS "restockOrder"(\
    "id"	INTEGER,\
    "issueDate"	TEXT,\
    "state"	TEXT,\
    "transportNote"	INTEGER,\
    "supplier"	INTEGER,\
    PRIMARY KEY("id" AUTOINCREMENT),\
    FOREIGN KEY("transportNote") REFERENCES "transportNote"("id") ON DELETE CASCADE,\
    FOREIGN KEY("supplier") REFERENCES "user"("id") ON DELETE CASCADE\
)');

    /*  RESTOCK ORDER - ITEM */
    db.run('CREATE TABLE IF NOT EXISTS "restockOrderItem"(\
        "restockOrder"	INTEGER,\
        "item"	INTEGER,\
        "supplierId" INTEGER, \
        "quantity"	INTEGER,\
        PRIMARY KEY("restockOrder", "item", "supplierId"),\
        FOREIGN KEY("supplierId") REFERENCES "user"("id") on DELETE CASCADE,\
        FOREIGN KEY("item", "supplierId") REFERENCES "item"("id", "supplier") on DELETE CASCADE,\
        FOREIGN KEY("restockOrder") REFERENCES "restockOrder"("id") on DELETE CASCADE\
    )');


    /* RESTOCK ORDER - SKU */
    /*
    db.run('CREATE TABLE IF NOT EXISTS "restockOrderItem"(\
    "restockOrder"	INTEGER,\
    "item"	INTEGER,\
    "quantity"	INTEGER,\
    PRIMARY KEY("restockOrder", "item"),\
    FOREIGN KEY("item") REFERENCES "sku"("id") on DELETE CASCADE,\
    FOREIGN KEY("restockOrder") REFERENCES "restockOrder"("id") on DELETE CASCADE\
    
)');*/

    db.run('CREATE TABLE IF NOT EXISTS "returnOrder"(\
    "id"	INTEGER,\
    "returnDate"	TEXT,\
    "restockOrder"	INTEGER,\
    PRIMARY KEY("id" AUTOINCREMENT),\
    FOREIGN KEY("restockOrder") REFERENCES "restockOrder"("id") on delete CASCADE\
)');

    db.run('CREATE TABLE IF NOT EXISTS "skuItem"(\
    "rfid"	TEXT,\
    "available"	INTEGER,\
    "dateOfStock"	TEXT,\
    "sku"	INTEGER,\
    "returnOrder"	INTEGER,\
    "internalOrder"	INTEGER,\
    "restockOrder"	INTEGER,\
    PRIMARY KEY("rfid"),\
    FOREIGN KEY("restockOrder") REFERENCES "restockOrder"("id") on delete set null,\
    FOREIGN KEY("returnOrder") REFERENCES "returnOrder"("id") on delete set NULL,\
    FOREIGN KEY("internalOrder") REFERENCES "internalOrder"("id") on delete set null,\
    FOREIGN KEY("sku") REFERENCES "sku" on delete CASCADE\
)');
    /* TEST DESCRIPTOR - SKU 1 to 1
        db.run('CREATE TABLE IF NOT EXISTS "testDescriptor"(\
        "id"	INTEGER,\
        "name"	TEXT,\
        "procedureDescription"	TEXT,\
        "sku"	INTEGER UNIQUE,\
        PRIMARY KEY("id" AUTOINCREMENT),\
        FOREIGN KEY("sku") REFERENCES "sku"("id") on delete CASCADE\
    )');
    */

    db.run('CREATE TABLE IF NOT EXISTS "testDescriptor"(\
    "id"	INTEGER,\
    "name"	TEXT,\
    "procedureDescription"	TEXT,\
    "sku"	INTEGER,\
    PRIMARY KEY("id" AUTOINCREMENT),\
    FOREIGN KEY("sku") REFERENCES "sku"("id") on delete CASCADE\
)');


    db.run('CREATE TABLE IF NOT EXISTS "position"(\
    "positionID"	TEXT,\
    "aisle"	TEXT,\
    "row"	TEXT,\
    "col"	TEXT,\
    "maxVolume"	INTEGER,\
    "maxWeight"	INTEGER,\
    "occupiedWeight"	INTEGER,\
    "occupiedVolume"	INTEGER,\
    PRIMARY KEY("positionID")\
)');

    db.run('CREATE TABLE IF NOT EXISTS "sku"(\
    "id"	INTEGER,\
    "description"	TEXT,\
    "weight"	NUMERIC,\
    "volume"	NUMERIC,\
    "prices"	NUMERIC,\
    "notes"	TEXT,\
    "position"	TEXT UNIQUE,\
    "availableQuantity"	INTEGER,\
    PRIMARY KEY("id" AUTOINCREMENT),\
    FOREIGN KEY("position") REFERENCES "position"("positionID") on delete set NULL on UPDATE CASCADE\
)');

    db.run('CREATE TABLE IF NOT EXISTS "testResult"(\
    "id"	INTEGER,\
    "date"	TEXT,\
    "result"	INTEGER,\
    "testDescriptor"	INTEGER,\
    "skuitem"	TEXT,\
    PRIMARY KEY("id" AUTOINCREMENT),\
    FOREIGN KEY("testDescriptor") REFERENCES "testDescriptor"("id") on DELETE CASCADE,\
    FOREIGN KEY("skuitem") REFERENCES "skuItem"("rfid") on DELETE CASCADE ON UPDATE CASCADE\
)');


    db.run("INSERT OR IGNORE INTO user('name','surname','email','type','password') VALUES ('John','Smith','user1@ezwh.com','customer','$2a$10$Ov/p4kTuQc.kXst2DFtcwuehsUaGJxyfbqp7huPmgIPXpFJ/mVWhu')")
    db.run("INSERT OR IGNORE INTO user('name','surname','email','type','password') VALUES ('John','Smith','qualityEmployee1@ezwh.com','qualityEmployee','$2a$10$l535Y6iBABg5gz764J3R1ekEFvo5hKK6Tq3cYHNjdbYdi.sLOC2uu')")
    db.run("INSERT OR IGNORE INTO user('name','surname','email','type','password') VALUES ('John','Smith','clerk1@ezwh.com','clerk','$2a$10$aG4KFydP7OloWHKcDnYAmu7GuK80v7cR1h8L8I3o9KTYdq4phzq7i')")
    db.run("INSERT OR IGNORE INTO user('name','surname','email','type','password') VALUES ('John','Smith','deliveryEmployee1@ezwh.com','deliveryEmployee','$2a$10$lKhHHTqS.gAzakjj/iMtJ.tbZ/F6JCXEt3fdHomkvfnJGwRvLfDMW');")
    db.run("INSERT OR IGNORE INTO user('name','surname','email','type','password') VALUES ('John','Smith','supplier1@ezwh.com','supplier','$2a$10$zSgNPIiVHZweG1M72l4fmuqpTYw9LATPh7df8Iui0bw7xyXyzJi86')")
    db.run("INSERT OR IGNORE INTO user('name','surname','email','type','password') VALUES ('John','Smith','manager1@ezwh.com','manager','$2a$10$rbAoH3cTTkHPW1x2pk90e.65imRw36fU4AoMjQlupEMXRCxsd5f7i')")

});
module.exports = db;
