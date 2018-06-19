// Modules
let express = require('express');
let ejs = require('ejs');

// Set express
let app = express();
app.set('view engine', 'ejs');

// Routes
app.get('/', function (req,res){
    res.send('test');
})

// Listen
app.listen(8080, function (req,res){
    console.log('Server Online')
})


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

(async function () {
    // Connection URL
    const url = 'mongodb://Phil76:SimplonERN76@ds161740.mlab.com:61740/mongo_blog';
    // Database Name
    //const dbName = 'myproject';
    let client;

    try {
        // Use connect method to connect to the Server
        client = await MongoClient.connect(url);

        const db = client.db('dbName');

    } catch (err) {
        console.log(err.stack);
    }

    if (client) {
        //client.db.show
        //console.log(client.db('mongo_blog'))
        const dbName = 'mongo_blog'
        const db = client.db(dbName);
        console.log("test: ", db.collection.s)

        //ajouter un document
        var objNew = {
            name: "GLaDOS",
            game: "Portal"
        };

        /*db.collection("posts").insert(objNew, null, function (error, results) {
            if (error) throw error;

            console.log("Le document a bien été inséré");
        });*/
        //afficher un document
        db.collection("posts").find().toArray(function (error, results) {
            if (error) throw error;
            console.log("results: ", results)
            console.log("table posts:")
            results.forEach(function (obj, i) {
                console.log(obj)
                /*db.collection("posts").remove(obj._id, null, function (error, result) {
                    if (error) throw error;
                });*/
                //console.lo(obj)
            });

        });
        //supprimer tous les documents
        db.collection("posts").remove( null, function (error, result) {
            if (error) throw error;
        });
        console.log("all posts removed")
        client.close();
    }
})();
