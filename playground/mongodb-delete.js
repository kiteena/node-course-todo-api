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

db.collection('Users').deleteMany({name: 'Kristina'}).then((result)=>{
    console.log(result);
});

db.collection('Users').deleteOne({_id: new ObjectID('5b2416b40bfe792d3657b2a0')}).then((result)=> {
    console.log(result);
});

// db.collection('Todos').deleteOne({text: 'Added note'}).then((result)=> {
//     console.log(result);
// });

// db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
//     console.log(result);
// });

//client.close();
});