// Modules
let express = require('express');
let ejs = require('ejs');
let Post = require('./Post');
let Comment = require('./Comment');
let User = require('./User');
// Set express
let app = express();
app.set('view engine', 'ejs');

//appel du dossier public (css, stripts.js)
app.use(express.static("public"));

// Appel index.ejs (accueil)
app.get('/', function (req, res) {
    res.render('index');
})

// Listen
app.listen(8080, function (req, res) {
    console.log('Server Online')
})

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


































function newPost(title, post, date, author) {
    var postUser = new Post(title, post, date, author);
    //console.log("newpot", postUser)
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
            db.collection("posts").insert(postUser, null, function (error, results) {
                if (error) throw error;
                console.log("Le document a bien été inséré");
                client.close();
            });
        }
    })();
}

function showLastPosts() {
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
            //afficher un document
            db.collection("posts").find().toArray(function (error, results) {
                if (error) throw error;
                //console.log("results: ", results)
                console.log("last 10 posts:")
                for (var i = results.length - 1; i > results.length - 11; i--) {
                    console.log(results[i], i)
                }
                client.close();
            });
        }
    })();
}

function searchPost(id) {
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
            //rechercher un document par id
            var MongoObjectID = require("mongodb").ObjectID; // Il nous faut ObjectID
            var idToFind = id; // Identifiant, sous forme de texte
            var objToFind = {
                _id: new MongoObjectID(idToFind)
            };
            db.collection("posts").findOne(objToFind, function (error, result) {
                if (error) {
                    throw error;
                }
                if (result == null) {
                    console.log("search: document not found")
                } else {
                    console.log("search: ", result);
                }
            });
        }
    })();
}

function removePost(id) {
    console.log("id: ", id);
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
            //supprimer un documents
            var MongoObjectID = require("mongodb").ObjectID; // Il nous faut ObjectID
            var idToFind = id; // Identifiant, sous forme de texte
            var objToFind = {
                _id: new MongoObjectID(idToFind)
            }; // Objet qui va nous servir pour effectuer la recherche
            db.collection("posts").remove(objToFind, null, function (error, result) {
                if (error) {
                    throw error;
                } else if (id) {
                    console.log("document " + id + " removed") 
                } else {
                    console.log("document " + id + " does not exist, nothing to remove")
                }
            });
        };
    })();
}
//newPost('tutoooo', 'je suis encore un test', '12/06/05', 'bobob');
showLastPosts();
//searchPost('5b2918b8c47b5811c031fbe3')
//removePost('5b291860ea629f1182563fee')
