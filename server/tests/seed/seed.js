const {Todo} = require('./../../models/todo');
const {Users} = require('./../../models/user');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken'); 

const userOneId = new ObjectID();
const userTwoId = new ObjectID(); 

const users =  [{
    _id: userOneId, 
    email: 'kristina1@gmail.com',
    password: 'password1', 
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
},{
    _id: userTwoId,
    email: 'kristina2@gmail.com',
    password: 'password2',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }] 
    
}]


const todos =[{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
},{
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 28282,
    _creator: userTwoId
}];

const populateTodos = (done)=> {
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=> (done()));
}

const populateUsers = (done) => {
    Users.remove({}).then(() => {
      var userOne = new Users(users[0]).save();
      var userTwo = new Users(users[1]).save();
  
      return Promise.all([userOne, userTwo])
    }).then(() => done());
  };

module.exports = {
    todos, 
    populateTodos, 
    users,
    populateUsers
}