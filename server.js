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
    const url = 'mongodb://Phil76:SimplonERN76@ds161740.mlab.com:61740/mongo_blog';
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
                console.log(obj)
            });
            client.close();
        });
        //supprimer tous les documents
        /*db.collection("posts").remove(null, function (error, result) {
            if (error) throw error;
        });
        console.log("all posts removed")*/
        //client.close();
        
    }
    //client.close();
})();
