// Modules
let express = require('express');
let bodyparser = require('body-parser');
let ejs = require('ejs');
/*let Post = require('./Post');
let Comment = require('./Comment');
let User = require('./User');*/
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Set express
let app = express();
app.use(bodyparser.urlencoded({
    extended: false
}));
app.set('view engine', 'ejs');

//appel du dossier public (css, stripts.js)
app.use(express.static(__dirname + '/public'));


//url de la database
const url = 'mongodb://admin:HG13admin@ds161740.mlab.com:61740/mongo_blog';
//nom de la database
const dbName = 'mongo_blog';
//tmpId sert pour l'edition de posts
let tmpId;

// Appel index.ejs (accueil) et affiche les 10 derniers posts
app.get('/', function (req, res) {
    //se connecte a la database
    MongoClient.connect(
        url,
        function (err, client) {
            if (err) {
                console.log(err);
                db.close();
            }
            let db = client.db(dbName);
            let last10Post = [];
            //afficher les 10 derniers posts
            db.collection("posts").find().toArray(function (error, results) {
                if (error) throw error;
                for (let i = results.length - 1; i > results.length - 11; i--) {
                    last10Post.push(results[i])
                }
                res.render('index', {
                    posts: last10Post
                });
                client.close();
            });
        }
    );
});

// POSTS

// Get Post 
app.get('/show/:id', function (req, res) {
    let id = req.params.id
    MongoClient.connect(
        url,
        function (err, client) {
            if (err) {
                console.log(err);
                db.close();
            }
            let db = client.db(dbName);
            //supprimer un documents
            let MongoObjectID = require("mongodb").ObjectID; // Il nous faut ObjectID
            let idToFind = id; // Identifiant, sous forme de texte
            let objToFind = {
                _id: new MongoObjectID(idToFind)
            }; // Objet qui va nous servir pour effectuer la recherche
            db.collection("posts").find(objToFind).toArray(function (error, results) {
                if (error) {
                    throw error;
                } else {
                    res.render('showPost', {
                        posts: results
                    });
                    client.close();
                }
            });
        }
    );
});

// search post
app.post('/search', function (req, res) {
    let id = req.body.search;
    MongoClient.connect(
        url,
        function (err, client) {
            if (err) {
                console.log(err);
                db.close();
            }
            let db = client.db(dbName);
            let posts = db.collection('posts');
            //cree un index pour pouvoir rechercher par mot clé
            posts.createIndex({
                "post": "text"
            });
            //lance la recherche par mot clé
            posts.find({
                $text: {
                    $search: id
                }
            }).toArray(function (err, results) {
                console.log(results)
                if (results.length == 0) {
                    res.render('noresult');
                } else {
                    res.render('showPost', {
                        posts: results
                    });
                }
                client.close();
            });
        }
    );
});

//newpost page, for typing a new post
app.get('/newpost', function (req, res) {
    res.render('newpost');
})
// addpost insert the post in database, when we click on newpost submit 
app.post('/addpost/', function (req, res) {
    //genere la date actuelle au format UTC
    let d = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    //cree l'objet postUser avecle contenu des inputs de newpost
    let postUser = {
        title: req.body.title,
        post: req.body.content,
        author: req.body.author,
        date: d
    };
    //se connecte a la database
    MongoClient.connect(
        url,
        function (err, client) {
            if (err) {
                console.log(err);
                db.close();
            }
            let db = client.db(dbName);
            let posts = db.collection('posts');
            //insert le nouveau post dans la database
            db.collection("posts").insert(postUser, null, function (error, results) {
                if (error) {
                    throw error;
                } else {
                    console.log("Le document a bien été inséré");
                    client.close();
                    res.redirect('/');
                }
            });
        }
    );
});

//editpage permet de modifier un ancien post
app.get('/editpage/:id', function (req, res) {
    let id = req.params.id;
    //se connecte a la database
    MongoClient.connect(
        url,
        function (err, client) {
            if (err) {
                console.log(err);
                db.close();
            }
            let db = client.db(dbName);
            let posts = db.collection('posts');
            let MongoObjectID = require("mongodb").ObjectID; // Il nous faut ObjectID
            let idToFind = id; // Identifiant, sous forme de texte
            //stocke l'id dans tmpId, pour pouvoir le supprimer apres edition
            tmpId = idToFind;
            let objToFind = {
                _id: new MongoObjectID(idToFind)
            };
            //cherche le post par son Id et l'affiche dans editpage
            db.collection("posts").findOne(objToFind, function (error, results) {
                console.log(results)
                if (error) {
                    throw error;
                } else {
                    res.render('editpage', {
                        post: results
                    });
                }
            });
        }
    );
});

//insert the edited post on database, and delete the old one (wip:need to change insert to update)
app.post('/editpost/', function (req, res) {
    //genere la date heure actuelle au format UTC
    let d = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let postUser = {
        title: req.body.title,
        post: req.body.content,
        author: req.body.author,
        date: "updated " + d
    };
    let id = tmpId;
    //se connecte a la database
    MongoClient.connect(
        url,
        function (err, client) {
            if (err) {
                console.log(err);
                db.close();
            }
            let db = client.db(dbName);
            let posts = db.collection('posts');
            db.collection("posts").insert(postUser, null, function (error, results) {
                if (error) {
                    throw error;
                } else {
                    console.log("Le document a bien été inséré");
                    res.redirect('/');
                    //supprimer un documents
                    let MongoObjectID = require("mongodb").ObjectID; // Il nous faut ObjectID
                    let idToFind = id; // Identifiant, sous forme de texte
                    let objToFind = {
                        _id: new MongoObjectID(idToFind)
                    }; // Objet qui va nous servir pour effectuer la recherche
                    db.collection("posts").remove(objToFind, null, function (error, result) {
                        client.close();
                    });
                }
            });
        }
    );
});
// Remove Post
app.get('/delete/:id', function (req, res) {
    let id = req.params.id;
    MongoClient.connect(
        url,
        function (err, client) {
            if (err) {
                console.log(err);
                db.close();
            }
            let db = client.db(dbName);
            let posts = db.collection('posts');
            let MongoObjectID = require("mongodb").ObjectID; // Il nous faut ObjectID
            let idToFind = id;
            let objToFind = {
                _id: new MongoObjectID(idToFind)
            };
            db.collection("posts").remove(objToFind, null, function (error, result) {
                if (error) {
                    throw error;
                } else if (id) {
                    console.log("document " + id + " removed");
                    res.redirect('/');
                    client.close();
                } else {
                    console.log("document " + id + " does not exist, nothing to remove");
                    client.close();
                }
            });
        }
    );
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





//essai pour tests unitaires
function tester() {
    return "hello";
}
module.exports = tester;
