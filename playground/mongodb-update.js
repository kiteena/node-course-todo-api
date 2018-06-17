//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client)=>{
if(err){
    return console.log('Unable to connect to Mongodb Server');
}
console.log('Connected to Mongodb Server');
const db = client.db('TodoApp');

// db.collection('Todos').findOneAndUpdate({
//     _id: new ObjectID('5b25ccec878f7914fb43e6bc')
// }, {
//     $set:{
//         completed: true
//     }

// },{ returnOriginal: false}).then((result)=>{
//     console.log(JSON.stringify(result, undefined, 2));
// });

db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b25cc941b197614968c0ff7')
}, {
    $set:{
        name: 'Rita'
    },
    $inc:{
        age: 1
    }

},{ returnOriginal: false}).then((result)=>{
    console.log(JSON.stringify(result, undefined, 2));
});

//client.close();
});


