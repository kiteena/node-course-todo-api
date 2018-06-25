const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user')
var id = '5b2e9539225cd21d0eca4177';

// Todo.remove({}).then((result) =>{
//     console.log(result);
// });

Todo.findOneAndRemove({_id: '5b307eb4f8e99111a9d8c14a'}).then((result)=>{
    console.log(result);
});

Todo.findByIdAndRemove('5b307eb4f8e99111a9d8c14a').then((todo)=>{
    console.log(todo);
});