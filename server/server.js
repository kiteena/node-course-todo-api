const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose.js');
let {Todo} = require('./models/todo');
let {Users} = require('./models/user');


var app = express();
const port = process.env.PORT || 3000;


//look this up
app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
        res.status(400).send(e);
    });

});

app.get('/todos', (req, res)=>{
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, (err)=>{
        res.status(400).send();
    });
});

app.listen(port, ()=>{
    console.log(`Started on port : ${port}`);
});

module.exports = {app};

