var sqlite3 = require('sqlite3').verbose();
var md5 = require('md5');

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        //No puedo abrir la BD
        console.error(err.message)
        throw err
    }
    else {
        console.log('Base de datos SQLite conectada.');
        db.run(`CREATE TABLE clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            lastName text,
            email text UNIQUE, 
            password text,
            address text,
            phone text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
                    if (err) {
                        //Tabla ya habia sido creada
                        console.log(err)
                    }else{
                        //Tabla creada, creando filas
                        var insert = 'INSERT INTO clients (name, lastName, email, password, address, phone) VALUES (?,?,?,?,?, ?)'
                        db.run(insert, ["admin","admin", "admin@example.com", md5("admin123456"), "{address: 'Av. Jorge Newbery 9041', coords: {lat:-32.90905007980166, lng: -60.76001950164087}}", "3413062851"]);
                    }
                }
        );
        db.run(`CREATE TABLE transports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            lastName text,
            email text UNIQUE, 
            password text,
            address text,
            phone text,
            carId text,
            transportTypes text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
                    if (err) {
                        //Tabla ya habia sido creada
                        console.log(err)
                    }else{
                        //Tabla creada, creando filas
                        var insert = 'INSERT INTO transports (name, lastName, email, password, address, phone, carId, transportTypes) VALUES (?,?,?,?,?,?,?,?)';
                        var params = ["admin", "admin", "admin@example.com", md5("admin123456"), "{address: 'Av. Jorge Newbery 9041', coords: {lat:-32.90905007980166, lng: -60.76001950164087}}", "3413062851", "ZRgPP9dBMm", "{mercaderia: false, residuos: false, mudanzas: false, construccion: false, electrodomesticos: false}"];
                        db.run(insert, params);
                    }
                }
        );
        db.run(`CREATE TABLE trips (
            idTrip INTEGER PRIMARY KEY AUTOINCREMENT,
            idClient text,
            idTransport text,
            startAddress text,
            endAddress text, 
            transportType text,
            bid integer,
            isBid integer,
            title text,
            description text,
            accepted integer,
            dispatched integer,
            completed integer,
            dateCreated text,
            dateExpected text,
            rating integer,
            offers text,
            delivered integer
            )`,
        (err) => {
                    if (err) {
                        //Tabla ya habia sido creada
                        console.log(err);

                    }else{
                        //Tabla creada, creando filas
                        var insert = 'INSERT INTO trips (idClient, idTransport, startAddress, endAddress, transportType, bid, isBid, title, description, accepted, dispatched, completed, dateCreated, dateExpected, rating, offers, delivered ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                        var params = [
                            '1',
                            '1',
                            '{"address": "Av. Jorge Newbery 9041, Rosario, Santa Fe, Argentina", "coords": {"lat": -32.95391828391403, "lng":-60.69664115103667}}',
                            '{"address": "Av. Jorge Newbery 9041, Rosario, Santa Fe, Argentina", "coords": {"lat": -32.95391828391403, "lng":-60.69664115103667}}',
                            'mercaderia',
                            300,
                            1,
                            'Que no se envien las bolsas de perros!',
                            'descripcion hecha de manera dinamica',
                            1,
                            1,
                            1, 
                            '22/01/2021',
                            '22/01/2021',
                            4,
                            '[]',
                            0
                        ];
                        db.run(insert, params);
                        insert = 'INSERT INTO trips (idClient, idTransport, startAddress, endAddress, transportType, bid, isBid, title, description, accepted, dispatched, completed, dateCreated, dateExpected, rating, offers ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                        params = [
                            '1',
                            '1',
                            '{"address": "Av. Jorge Newbery 9041, Rosario, Santa Fe, Argentina", "coords": {"lat": -32.95391828391403, "lng":-60.69664115103667}}',
                            '{"address": "Av. Jorge Newbery 9041, Rosario, Santa Fe, Argentina", "coords": {"lat": -32.95391828391403, "lng":-60.69664115103667}}',
                            'mercaderia',
                            300,
                            1,
                            'Que no se envien las bolsas de perros!',
                            'descripcion hecha de manera dinamica',
                            0,
                            0,
                            0, 
                            '22/01/2021',
                            '22/01/2021',
                            4,
                            '[]',
                            0
                        ];
                        db.run(insert, params);
                    }
                }
        );
        db.run(`CREATE TABLE cars (
            objectId text,
            Year text,
            Make text,
            Model text
            )`,
        (err) => {
                    if (err) {
                        //Tabla ya habia sido creada

                    }else{
                        //Tabla creada, creando filas
                    }
                }
        );
        db.run(`CREATE TABLE notifications (
            idNotified text,
            clientType text,
            notificationType text
            )`,
        (err) => {
                    if (err) {
                        //Tabla ya habia sido creada
                        console.log(err);

                    }else{
                        //Tabla creada, creando filas
                        console.log('notifications created')
                    }
                }
        );
    }
    
}
);



module.exports = db;