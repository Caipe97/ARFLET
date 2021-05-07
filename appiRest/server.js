//Dependencias
var express = require('express');
var app = express();
var db = require("./database.js");
var geolib = require("geolib");

//Dependencias para entender requests POST
var bodyParser = require("body-parser");
const md5 = require('md5');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CODIGO
app.use(express.json());

app.get('/', function(req, res) {
    respuesta = {
        mensaje: 'El servidor funciona OK',
        codigo: 501,
    }
    res.send(respuesta);
});
var HTTP_PORT = 3000
var server = app.listen(HTTP_PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Listening at http://%s%s", host, port);
});

//Devolver lista de todos los usuarios DEPRECATED
app.get('/api/users', function(req, res, next) {
    var query = "select * from user";
    var params = [];
    //Comando para devolver todos los valores de una query de la db, el ultimo parametro es el callback de la query:
    db.all(query, params, function(err, rows) { 
            if (err) {
                res.status(400).json({"error": err.message});
                return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
        });
});


//Devolver id de un usuario segun el mail: usado para chequear si cierto email esta registrado
//:userType es una expresión especial de EXPRESS, se reemplaza por el valor que pase por parametro que sea un id de usuario
app.get('/api/user/:userType/:email', function(req, res, next) {
    var query; //El simbolo ? se mapea a un item del arreglo "params", en el mismo orden
    if(req.params.userType == 'c'){
        query = "select * from clients where email = ?";
    }
    else{
        query = "select * from transports where email = ?"
    }
    var params = [req.params.email];
    //db.get es para obtener 1 solo dato.
    db.get(query, params, function(err, row) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        if (row == null){
            res.json({
                message:"User not found",
                id: -1,
            })
        }else{
            res.json({
                message:"user exists",
                id: row.id,
            })
        }
    });
});

//Devolver un usuario entero segun id y tipo
app.get('/api/userParam/:userType/:id', function(req, res, next) {
    var userType;
    var query;
    if(req.params.userType == 'c'){
        userType = 'clients';
        
    }
    else{
        userType = 'transports'
    }
    var query = "select * from " + userType + " where id = ?";
    var params = [ req.params.id];
    console.log("Id is: " + req.params.id);
    console.log("query is: " + req.params.id);
    //db.get es para obtener 1 solo dato.
    db.get(query, params, function(err, row) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        if (row == null){
            res.json({
                message:"User not found",
                data: -1,
            })
        }else{
            res.json({
                message:"success",
                data: row,
            })
        }
    });
});


//Registrar un nuevo usuario
app.post("/api/signUp", function(req, res, next) {
    var errors = [];
    if (!req.body.userType){
        errors.push("No userType specified");
    }
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        userType: req.body.userType,
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: md5(req.body.password),
        address: JSON.stringify(req.body.address),
        phone: req.body.phone,
        carId: req.body.carId,
        transportTypes: JSON.stringify(req.body.transportTypes)
    }
    console.log(req.body.phone)
    var query;
    var params;
    if(data.userType == 'c'){
        query = 'INSERT INTO clients (name, lastName, email, password, address, phone) VALUES (?,?,?,?,?,?)';
        params = [data.name, data.lastName, data.email, data.password, data.address, data.phone]; 
    }
    else{
        query = 'INSERT INTO transports (name, lastName, email, password, address, phone, carId, transportTypes) VALUES (?,?,?,?,?,?,?,?)';
        params = [data.name, data.lastName, data.email, data.password, data.address, data.phone, data.carId, data.transportTypes];
    }
    db.run(query, params, function(err, result) {
        if (err){
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message": "Registered user",
            "data": data, 
            "id": this.lastID
        })
    });
})

//Loguearse
app.post("/api/login", function(req, res, next) {
    var errors = [];
    console.log(req.body);
    if (!req.body.userType){
        errors.push("No userType specified");
    }
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        userType: req.body.userType,
        email: req.body.email,
        password: md5(req.body.password)
    }
    console.log(data);
    var query;
    if(data.userType == 'c'){
        query = 'select * from clients where email = ? and password = ?';
    }
    else{
        query = 'select * from transports where email = ? and password = ?';
    }
    var params = [data.email, data.password];
    db.get(query, params, function(err, row) {
        if (err){
            res.status(400).json({"error":err.message});
            return;
        }
        if (row == null){
            res.json({
                message:"User not found",
                id: -1,
            })
        }else{
            console.log("success");
            res.json({
                message:"Logged in",
                id: row.id,
                data: row
            })
        }
    })
})
//Updatear un usuario ACTUALIZAR!!
app.patch("/api/user/:id", function(req, res, next) {
    var data = {
        userType: req.body.userType,
        name: req.body.name,
        email: req.body.email,
        password : req.body.password ? md5(req.body.password) : null,
        address: JSON.stringify(req.body.address),
        phone: toString(req.body.phone),
        carId: req.body.carId,
        transportTypes: JSON.stringify(req.body.transportTypes),


    };
    db.run(
        `UPDATE user set
            name = COALESCE(?,name),
            lastName = COALESCE(?,lastName),
            email = COALESCE(?,email),
            password = COALESCE(?,password),
            address = COALESCE(?,address)
            WHERE id = ?`,
            [data.userType, data.name, data.email, data.password, req.params.id],
            function(err, result) {
                if (err) {
                    res.status(400).json({"error":res.message});
                    return;
                }
                res.json({
                    message: "success",
                    data: data, 
                    changes: this.changes
                });
            }
    );
});

//Eliminar un usuario
app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM user WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
});

//Sobre Registro

//Obtener All Car Makes
app.get('/api/cars', function(req, res, next) {
    var query = "select distinct Make from cars";
    var params = [];
    //db.all es para obtener mas de un dato.
    db.all(query, params, function(err, rows) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

//Obtener modelos de cierto Make
app.get('/api/cars/:make', function(req, res, next) {
    var query = "select distinct Model from cars where Make = ?"; //El simbolo ? se mapea a un item del arreglo "params", en el mismo orden
    var params = [req.params.make];
    //db.get es para obtener 1 solo dato.
    db.all(query, params, function(err, rows) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});
//Obtener Años de cierto modelo
app.get('/api/cars/:make/:model', function(req, res, next) {
    var query = "select Year from cars where Make = ? and Model = ?"; //El simbolo ? se mapea a un item del arreglo "params", en el mismo orden
    var params = [req.params.make, req.params.model];
    console.log(req.params);
    //db.get es para obtener 1 solo dato.
    db.all(query, params, function(err, rows) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

//Obtener ID del auto teniendo Make, modelo y año
app.get('/api/cars/:make/:model/:year', function(req, res, next) {
    var query = "select objectId from cars where Make = ? and Model = ? and Year = ?"; //El simbolo ? se mapea a un item del arreglo "params", en el mismo orden
    var params = [req.params.make, req.params.model, parseInt(req.params.year)];
    console.log(params);
    //db.get es para obtener 1 solo dato.
    db.get(query, params, function(err, row) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});
//Obtener auto según ID
app.get('/api/carsfromID/:id', function(req, res, next) {
    var query = "select * from cars where objectId = ?"; //El simbolo ? se mapea a un item del arreglo "params", en el mismo orden
    var params = [req.params.id];
    console.log(params);
    //db.get es para obtener 1 solo dato.
    db.get(query, params, function(err, row) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        console.log(row);
        res.json({
            "message":"success",
            "data": row.Year +' '+ row.Make +' '+ row.Model
        })
    });
});

//Obtener viajes dado un ID de usuario (usar en clientHomeScreen para viajes de cada usuario) y si son completados o no
app.get('/api/trips/fromid/:clientType/:id/:completed', function(req, res, next) {
    var clientType
    if(req.params.clientType == 't'){
        clientType = 'idTransport'
    }
    else{
        clientType = 'idClient'
    }
    var query = "select * from trips where "+ clientType +" = ? and completed = ?"

    var isCompleted;
    switch (req.params.completed){
        case 'true':
            isCompleted = 1;
            break;
        default:
            isCompleted = 0;
    }
    var params = [req.params.id, isCompleted];
    console.log(params);
    //db.get es para obtener 1 solo dato, db.all para varios.
    db.all(query, params, function(err, rows) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

//Obtener un trip según id del trip
app.get('/api/trips/fromidTrip/:id', function(req, res, next) {
    var query = "select * from trips where idTrip = ?"; //Ordenado por date de creacion?

    var params = [req.params.id];
    console.log(params);
    //db.get es para obtener 1 solo dato, db.all para varios.
    db.get(query, params, function(err, row) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":row
        })
    });
});



//Crear un viaje en la db
app.post("/api/createTrip", function(req, res, next) {
    var errors = [];
    if (!req.body.bid){
        errors.push("No bid specified");
    }
    if (!req.body.dateCreated){
        errors.push("No dateCreated specified");
    }
    if (!req.body.dateExpected){
        errors.push("No dateExpected specified");
    }
    if (!req.body.description){
        errors.push("No description specified");
    }
    if (!req.body.endAddress){
        errors.push("No endAddress specified");
    }
    if (!req.body.startAddress){
        errors.push("No startAddress specified");
    }
    if (!req.body.idClient){
        errors.push("No idClient specified");
    }
    if (!req.body.title){
        errors.push("No title specified");
    }
    if (!req.body.transportType){
        errors.push("No transportType specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        bid: parseInt(req.body.bid),
        isBid: parseInt(req.body.isBid),
        dateCreated: req.body.dateCreated,
        dateExpected: req.body.dateExpected,
        description: req.body.description,
        endAddress: req.body.endAddress,
        startAddress: req.body.startAddress,
        idClient: req.body.idClient,
        title: req.body.title,
        transportType: req.body.transportType,
        accepted: 0,
        dispatched: 0,
        completed: 0,
        idTransport: 0, //no hay transport todavia
        rating: 0,
        offers: '[]',
        delivered: 0
    }

    var query = 'INSERT INTO trips (bid, dateCreated, dateExpected, description, endAddress, startAddress, idClient, title, transportType, accepted, dispatched, completed, idTransport, isBid, rating, offers, delivered) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    var params = [data.bid, data.dateCreated, data.dateExpected, data.description, data.endAddress, data.startAddress, data.idClient, data.title, data.transportType, data.accepted, data.dispatched, data.completed, data.idTransport, data.isBid, data.rating, data.offers, data.delivered]; 
    db.run(query, params, function(err, result) {
        if (err){
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message": "Registered trip",
            "data": data, 
            "id": this.lastID
        })
    });
})

//Obtener trips disponibles que estén en un determinado radio (tanto de origen como destino)
app.post('/api/trips/fetchTrips', function(req, res, next) {
    var errors = []
    var firstCoordinates = ''
    var secondCoordinates = '';
    console.log(req.body);
    if (!req.body.transportTypes){
        errors.push("No transportTypes specified");
    }
    if ((!req.body.startAddress || !req.body.endAddress) || req.body.startAddress.address == ''){
        errors.push("No addresses specified");
    }
    else{
        if (req.body.endAddress.address == ''){
            //Circulo sobre startAddress
            firstCoordinates = {latitude: req.body.startAddress.coords.lat, longitude: req.body.startAddress.coords.lng}
            secondCoordinates = firstCoordinates;
        }
        else{
            //Viajes sobre ambos
            firstCoordinates = {latitude: req.body.startAddress.coords.lat, longitude: req.body.startAddress.coords.lng}
            secondCoordinates = {latitude: req.body.endAddress.coords.lat, longitude: req.body.endAddress.coords.lng}

        }
    }
    if (!req.body.areaRadio){
        errors.push("No radio specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    //Generar query usando los transportTypes
    var reqBody = req.body.transportTypes;
    var keys = Object.keys(reqBody);
    console.log(keys);
    var queryAppend = '';
    keys.forEach(key =>{
        if (reqBody[key] == true){
            if(queryAppend == ''){//Primer caso
                queryAppend = 'transportType = ' + "'" + key + "'"; 
            }
            else{//Los demas casos
                queryAppend = queryAppend.concat(' OR transportType = ' + "'" + key + "'" )
            }
        }
    })
    if(queryAppend == ''){
        errors.push("No valid transportTypes specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var query = "select * from trips where accepted = 0 AND (" + queryAppend + ")" ;
    
    var params = [];
    //db.get es para obtener 1 solo dato, db.all para varios.
    db.all(query, params, function(err, rows) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        //Aca tengo que hacer el parse de las coordenadas para sacar el radio luego
        var matchingTrips = []; //Aquellos trips que cumplan el requisito de las coordenadas
        rows.forEach(trip => {
            //Calcular la coordenada
            var tripStart = JSON.parse(trip.startAddress);
            var tripEnd = JSON.parse(trip.endAddress);
            console.log("for a trip, first coord compare is: ")
            console.log(geolib.getDistance(firstCoordinates, {latitude: tripStart.coords.lat, longitude: tripStart.coords.lng}));
            console.log("for a trip, second coord compare is: ")
            console.log(geolib.getDistance(secondCoordinates, {latitude: tripEnd.coords.lat, longitude: tripEnd.coords.lng}));

            if( 
                (geolib.getDistance(firstCoordinates, {latitude: tripStart.coords.lat, longitude: tripStart.coords.lng}) <= req.body.areaRadio) &&
                (geolib.getDistance(secondCoordinates, {latitude: tripEnd.coords.lat, longitude: tripEnd.coords.lng}) <= req.body.areaRadio))
                {
                    console.log("got a match!")
                    matchingTrips.push(trip);
                }
        })

        res.json({
            "message":"success",
            "data":matchingTrips
        })
    });
});

//Postear una oferta en un viaje
app.post("/api/trips/postOffer", function(req, res, next) {
    var errors = [];
    console.log(req.body);
    if (!req.body.idTransport){
        errors.push("No idTransport specified");
    }
    if (!req.body.name){
        errors.push("No name specified");
    }
    if (!req.body.lastName){
        errors.push("No lastName specified");
    }
    if (!req.body.idTrip){
        errors.push("No idTrip specified");
    }
    if (!req.body.bid){
        errors.push("No bid specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        idTransport: req.body.idTransport,
        name: req.body.name,
        lastName: req.body.lastName,
        idTrip: req.body.idTrip,
        bid: req.body.bid
    }
    console.log(data);
    var query = 'select offers, idClient, isBid from trips where idTrip == ?';
    var params = [data.idTrip];
    db.get(query, params, function(err, row) {
        if (err){
            res.status(400).json({"error":err.message});
            return;
        }
        if (row == null){
            res.json({
                message:"Trip not found",
                data: ''
            })
        }else{
            console.log("result: ")
            console.log(row);
            var offersToUpdate = JSON.parse(row.offers);
            //Tengo las offers, ahora le agrego los datos nuevos y le hago un update al trip
            if(row.isBid){
                offersToUpdate.push({idTransport: data.idTransport.toString(), name: data.name, lastName: data.lastName, bid: data.bid});
            }
            else{
                offersToUpdate.push({idTransport: data.idTransport.toString(), name: data.name, lastName: data.lastName, bid: -1}); //Sin el bid
            }
            
            console.log(offersToUpdate);
            //Updateo el offer
            var offerQuery = 'UPDATE trips SET offers = ? WHERE idTrip = ?';
            var offerParams = [JSON.stringify(offersToUpdate), data.idTrip];

            db.run(offerQuery, offerParams, function(err, result) {
                if (err){
                    res.status(400).json({"error":err.message});
                    return;
                }
                else{
                    //Se hizo bien el update! Me falta generar la notificación
                    var notifQuery = 'INSERT INTO notifications (type, idTrip, idTransport,idClient, offer) VALUES (?,?,?,?,?)';
                    var notifType;
                    var notifIdClient = row.idClient;
                    var notifIdTransport = data.idTransport;
                    var notifIdTrip = data.idTrip;
                    var notifOffer;
                    if(row.isBid){
                        notifType = 'newOffer';
                        notifOffer = data.bid;
                    }
                    else{
                        notifType = 'newTripRequest'
                    }
                    var notifParams = [notifType, notifIdTrip, notifIdTransport, notifIdClient, notifOffer];
                    db.run(notifQuery, notifParams, function(err, result) {
                        if(err){
                            res.status(400).json({"error":err.message});
                            return;
                        }
                        else{
                            //Se realizó la notificación
                            res.json({
                                message:"Offer sent"
                            })
                        }
                    })

                }
            });
        }
    })

})

//Obtener notificaciones de un usuario
app.get('/api/users/getNotifs/:clientType/:id', function(req, res, next) {
    var idType;
    if(req.params.clientType == 'c'){
        idType = 'idClient';
    }
    else{
        idType = 'idTransport';
    }
    console.log("hola");
    var query = "select * from notifications where " + idType + " = ?";
    var params = [req.params.id];
    db.all(query, params, function(err, rows) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

//Setear un trip como dispatched, delivered o completed
app.get('/api/trips/update/:id/:parameter', function(req, res, next) {
    var parameter;
    var errors = [];
    if(req.params.parameter != 'accepted' && req.params.parameter != 'dispatched' && req.params.parameter != 'delivered' && req.params.parameter != 'completed'){
        errors.push("Invalid trip parameter");
    }
    if(!req.params.parameter){
        errors.push("No parameter specified");
    }
    if(!req.params.id){
        errors.push("No id specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var query = 'UPDATE trips SET ' + req.params.parameter + ' = 1 WHERE idTrip = ?'
    var params = [req.params.id];
    db.run(query, params, function(err, result) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
    });
    //Tengo que generar la notif al cliente ( no si es completed, porque es al transportista... )
    //Primero, hago get del trip para tener los detalles del transportista y cliente
    query = "select * from trips where idTrip = ?"
    params = [req.params.id];
    db.get(query, params, function(err, row) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        if (row == null){
            res.json({
                message:"Trip not found",
                id: -1,
            })
        }else{

            //Obtuve el trip, elimino notifs viejas..
            console.log('deleting old notifs...');

            var notifQuery= 'DELETE FROM notifications WHERE idTrip = ? AND ('
            var notifType;

            var deleteTypes = '';
            switch (req.params.parameter){
                case 'dispatched':
                    notifType = 'dispatched';
                    deleteTypes = 'type = "newOffer" OR type = "newTripRequest")';
                    break;
                case 'delivered':
                    notifType = 'arrived';
                    deleteTypes = 'type = "newOffer" OR type = "newTripRequest" OR type = "dispatched")';
                    break;
                case 'completed':
                    notifType = 'NO DEVOLVERME!'
                    deleteTypes = 'type = "newOffer" OR type = "newTripRequest" OR type = "dispatched" OR type = "arrived")'
                default:
            }
            notifQuery = notifQuery + deleteTypes;
            var notifParams = [req.params.id];


            //Elimino las notifs viejas que ya no sirven...
            db.run(notifQuery, notifParams, function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log('deleted old notifs successfully');
                });
            


            if(req.params.parameter == 'completed'){ //Completed no genera una notificación...
                res.json({
                    message:"Trip set as completed"
                })
                return;
            }
            notifQuery = 'INSERT INTO notifications (type, idTrip, idTransport,idClient) VALUES (?,?,?,?)';
            
            var notifIdClient = row.idClient;
            var notifIdTransport = row.idTransport;
            var notifIdTrip = req.params.id;
            notifParams = [notifType, notifIdTrip, notifIdTransport, notifIdClient];

            db.run(notifQuery, notifParams, function(err, result) {
                if(err){
                    res.status(400).json({"error":err.message});
                    return;
                }
                else{
                    //Se realizó la notificación, tengo que eliminar las notifs viejas!


                    res.json({
                        message:"Notification sent"
                    })
                }
            })
        }
    });


});

//Setear un trip como accepted (necesito el ID de transportista)
app.get('/api/trips/assignToTransport/:idTrip/:idTransport/:bid', function(req, res, next) {
    var parameter;
    var errors = [];
    var query = 'UPDATE trips SET idTransport = ?, accepted = 1, bid = ? WHERE idTrip = ?';
    var params = [req.params.idTransport, req.params.bid, req.params.idTrip];
    if(!req.params.idTransport){
        errors.push("No idTransport specified");
    }
    if(req.params.bid == -1){
        query = 'UPDATE trips SET idTransport = ?, accepted = 1 WHERE idTrip = ?';
        params = [req.params.idTransport, req.params.idTrip];
    }
    if(!req.params.idTrip){
        errors.push("No idTrip specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    db.run(query, params, function(err, result) {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"Assigned to idTransport = "+ req.params.idTransport +", set accepted to 1 sucessfully for id = " + req.params.idTrip,
        })
    });
});

app.use(function(req, res){ //Todo lo demás
    res.status(404).send('Not Found');
});