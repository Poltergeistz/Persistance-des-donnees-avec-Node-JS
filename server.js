// Modules
let express = require('express');
let bodyparser = require('body-parser');
let ejs = require('ejs');
let Post = require('./Post');
let Comment = require('./Comment');
let User = require('./User');
// Set express
let app = express();
app.use(bodyparser.urlencoded({
    extended: false
}));
app.set('view engine', 'ejs');

//appel du dossier public (css, stripts.js)
app.use(express.static(__dirname + '/public'));
const url = 'mongodb://admin:HG13admin@ds161740.mlab.com:61740/mongo_blog';
const dbName = 'mongo_blog'
//app.use('/static', express.static(__dirname + '/public'));
// Appel index.ejs (accueil)
app.get('/', function (req, res) {
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
            let last10Post = [];
            //afficher un document
            db.collection("posts").find().toArray(function (error, results) {
                if (error) throw error;
                //console.log("results: ", results)
                //console.log("last 10 posts:")
                for (var i = results.length - 1; i > results.length - 11; i--) {
                    //console.log(results[i], i)
                    last10Post.push(results[i])
                }
                res.render('index', {
                    posts: last10Post
                });
                client.close();
            });
        }
    })();

})

// POSTS

// Get Post
app.get('/show/:id', function (req, res) {
    //let id = req.params.id;
    //console.log(id);
    //data.posts.splice(data.posts[req.params.id], 1);
    //commit(data);
    (async function () {
        let id = req.params.id
        console.log(id)
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
            //console.log(id);
            var objToFind = {
                _id: new MongoObjectID(idToFind)
            }; // Objet qui va nous servir pour effectuer la recherche
            db.collection("posts").find(objToFind).toArray(function (error, results) {
                if (error) {
                    throw error;
                } else {
                    //let postArr = [results]
                    //console.log("document " + id + " removed");
                    res.render('showPost', {
                        posts: results
                    });
                    client.close();
                }
            });
        };
    })();

});
// search post
app.post('/search', function (req, res) {
    let id = req.body.search;
    console.log(id);
    MongoClient.connect(
        url,
        function (err, client) {
            if (err) {
                console.log(err);
                db.close();
            }
            var db = client.db(dbName);
            //console.log('youpi');
            var posts = db.collection('posts');
            posts.createIndex({"post":"text"});
            posts.find({
                $text: {$search: id}
                //post: id
            }).toArray(function (err, results) {
                console.log(results)
                if (results.length == 0){
                    res.render('noresult');
                    console.log("no result")
                } else {
                res.render('showPost', {
                    posts: results
                });
                }
                console.log(results);
                client.close();
            });
        }
    );
})
// Add Post

// Update Post

// Remove Post
app.get('/delete/:id', function (req, res) {
    let id = req.params.id;
    console.log(id);
    //data.posts.splice(data.posts[req.params.id], 1);
    //commit(data);
    (async function () {
        let id = req.params.id
        console.log(id)
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
                    console.log("document " + id + " removed");
                    res.redirect('/');
                    client.close();
                    /*res.render('index', {
                        posts: results
                    });*/
                } else {
                    console.log("document " + id + " does not exist, nothing to remove")
                }
            });
        };
    })();

});

// COMMENTS

// Get Comment

// Add Comment

// Update Comment

// Remove Comment

// Listen
app.listen(8080, function (req, res) {
    console.log('Server Online')
})

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');




//essai pour tests unitaires
function tester() {
    return "hello";
}
module.exports = tester;









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
var c;

function showPost(id) {
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
            var MongoObjectID = require("mongodb").ObjectID; // Il nous faut ObjectID
            var idToFind = id; // Identifiant, sous forme de texte
            var objToFind = {
                _id: new MongoObjectID(idToFind)
            };
            db.collection("posts").find(objToFind).toArray(function (error, results) {
                if (error) throw error;
                //console.log("results: ", results)
                console.log("post:")
                //for (var i = results.length - 1; i > results.length - 11; i--) {
                console.log(results);
                c = results;
                //}
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
//showLastPosts();
//showPost('5b2a200e1a969a137fefcc3c');
//console.log('ccc' +c);
//searchPost('5b2918b8c47b5811c031fbe3')
//removePost('5b291860ea629f1182563fee')



// test chai

function tester() {
    return 'hello world';
};

module.exports = tester;
