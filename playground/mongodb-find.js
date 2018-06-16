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

// db.collection('Todos').find({
//     _id: new ObjectID('5b2414e99619ae2b77e13480') 
// }).toArray().then((docs)=>{
//     console.log('Todos');
//     console.log(JSON.stringify(docs, undefined, 2));
// }, (err) =>{
//     console.log('Unable to fetch todos', err);
// });
// db.collection('Todos').find().count().then((count)=>{
//     console.log(`Todos counts ${count}`);
// }, (err) =>{
//     console.log('Unable to fetch todos', err);
// });
db.collection('Users').find({
    name: 'Kristina'
}).toArray().then((docs)=>{
    console.log(JSON.stringify(docs, undefined, 2));
}, (err)=>{
    console.log('Unable to fetch Kristinas');S
});

//client.close();
});