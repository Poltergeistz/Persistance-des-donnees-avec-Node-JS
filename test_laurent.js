var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://admin:HG13admin@ds161740.mlab.com:61740/mongo_blog';

var dbName = 'mongo_blog';

function test(){
MongoClient.connect(
  url,
  function(err, client) {
    if (err) {
      console.log(err);
      db.close();
    }
    var db = client.db(dbName);
    console.log('youpi');
    var posts = db.collection('posts');

    /*posts.updateMany({ title: '1' }, { $set: { author: 'toto' } }, function(
      err,
      result
    ) {
        
        
      console.log('updated');
    });*/
    /*posts.deleteOne({ title: '1' }, function(err, result) {
      //console.log('Deleted:' + result.deletedCount);
    });*/
    posts.find({ title: 'test' }).toArray(function(err, docs) {
      console.log(docs);
        db.close();
    });
  }
);
}
 test()