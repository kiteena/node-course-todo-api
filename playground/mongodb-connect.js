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

// db.collection('Todos').insertOne({
//     text: 'Something to do',
//     completed: false
// }, (err, result)=>{
//     if(err){
//         return console.log('Unable to insert item in mongodb', err);
//     }

//     console.log(JSON.stringify(result.ops, undefined, 2));
// })

// db.collection('Users').insertOne({
//     name: 'Kristina',
//     age: 28,
//     location: 'Santa Clara, CA'
// }, (err, result)=>{
//     if(err){
//         return console.log('Unable to add User to mongodb', err );
//     }
//     console.log(JSON.stringify(result.ops, undefined, 2));
//     console.log(result.ops[0]._id.getTimestamp());
// });

client.close();
});