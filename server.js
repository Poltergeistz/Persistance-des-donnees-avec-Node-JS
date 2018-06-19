// Modules
let express = require('express');
let ejs = require('ejs');

// Set express
let app = express();
app.set('view engine', 'ejs');

// Routes
app.get('/', function (req, res) {
    res.send('test');
})

// Listen
app.listen(8080, function (req, res) {
    console.log('Server Online')
})

//Post class
class Post {
    constructor(title, post, date, author) {
        this.title = title;
        this.post = post;
        this.date = date;
        this.author = author;
    }
}
var post1 = new Post('test', 'je suis du texte', '12/12/05', 'moi');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

(async function () {
    // Connection URL
    const url = 'mongodb://admin:HG13admin@ds161740.mlab.com:61740/mongo_blog';
    let client;

    try {
        // Use connect method to connect to the Server
        client = await MongoClient.connect(url);

        const db = client.db('dbName');

    } catch (err) {
        console.log(err.stack);
    }

    if (client) {
        const dbName = 'mongo_blog'
        const db = client.db(dbName);


        //ajouter un document
        db.collection("posts").insert(post1, null, function (error, results) {
            if (error) throw error;

            console.log("Le document a bien été inséré");
            //client.close();
        });
        //afficher un document
        db.collection("posts").find().toArray(function (error, results) {
            if (error) throw error;
            //console.log("results: ", results)
            console.log("table posts:")
            results.forEach(function (obj, i) {
                
                    console.log(obj, i)
                
            });
            client.close();
        });


        //recherche par id
        /*var MongoObjectID = require("mongodb").ObjectID; // Il nous faut ObjectID
        var idToFind = "5b28e8e91309d90bb879f71c"; // Identifiant, sous forme de texte
        var objToFind = {
            _id: new MongoObjectID(idToFind)
        };
        db.collection("posts").findOne(objToFind, function (error, result) {
            if (error) throw error;

            console.log(result);
        });*/


        //supprimer tous les documents
        /*db.collection("posts").remove(null, function (error, result) {
            if (error) throw error;
        });
        console.log("all posts removed")*/
        //client.close();

    }
    //client.close();
})();

function newPost(title, post, date, author) {
    var post = new Post(title, post, date, author);
    (async function () {
        const url = 'mongodb://admin:HG13admin@ds161740.mlab.com:61740/mongo_blog';
        let client;
        try {
            // Use connect method to connect to the Server
            client = await MongoClient.connect(url);
            const db = client.db('dbName');
        } catch (err) {
            console.log(err.stack);
        }
        if (client) {
            const dbName = 'mongo_blog'
            const db = client.db(dbName);
            //ajouter un document
            db.collection("posts").insert(post, null, function (error, results) {
                if (error) throw error;
                console.log("Le document a bien été inséré");
                client.close();
            });
        }
    })();
}

newPost('tutoooo', 'je suis encore du texte', '12/06/05', 'bob')
