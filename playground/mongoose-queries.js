const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user')
var id = '5b2e9539225cd21d0eca4177';

var userId = '5b2af83108c18c3769d75019';

// Users.findById(userId).then((user)=>{
//     if(!user){
//         return console.log('User not found');
//     }
//     console.log('User found : ', user);
// }).catch((e) =>console.log('Invalid User', e));

Users.findById(userId).then((user)=>{
    if(!user){
        return console.log('User not found');
    }
    console.log('User found : ', JSON.stringify(user, undefined, 2));
}, (e)=>{
    console.log('Invalid User', e);
});

// if(!ObjectID.isValid(id)){
//     console.log('ID is not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos)=>{
//     console.log('Todos', todos);
// });

Todo.findOne({
    _id: id
}).then((todo)=>{
    console.log('Todo', todo);
});

Todo.findById(id).then((todo)=>{
    if(!todo){
        return console.log('Id is not found');
    }
    console.log('Todo by Id', todo);
}, ()=> { }).catch((e)=> console.log(e));