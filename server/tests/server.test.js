const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

const todos =[{
    _id: new ObjectID(),
    text: 'First test todo'
},{
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 28282
}];


beforeEach((done)=> {
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=> (done()));
});

describe('POST/todos', ()=>{
    it('should create a new todo', (done)=>{
        let text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err, res)=> {
            if(err){
                return done(err);
            }

            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=> done(e));
        });
    });

    it('should not create todo with invalid data', (done)=>{
        let text = "";

        request(app)
        .post('/todos')
        .send({text})
        .expect(400)
        .end((err, res)=>{
            if(err) {
                return done(err);
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=> done(e));
        })
    });
});

describe('GET /todos', ()=>{
    it('should get all todos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });

});

describe('Get /todos/:id', ()=>{
    it('should return a todo doc', (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done)=>{
        let newId = new ObjectID();
        request(app)
        .get(`/todos/${newId.toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done)=>{
        let badId ='123';
        request(app)
        .get(`/todos/${badId}`)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id', ()=>{
    it('should delete a todo', (done)=>{
        var hexId = todos[1]._id.toHexString();
        
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.findById(hexId).then((todo)=>{
                expect(todo).toNotExist();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return 404 if todo was not found', (done)=>{
        let newId = new ObjectID();
        request(app)
        .delete(`/todos/${newId.toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id was invalis', (done)=>{
        let badId ='123';
        request(app)
        .delete(`/todos/${badId}`)
        .expect(404)
        .end(done);
    });
 });

 describe('PATCH /todos/:id',()=>{
    it('should update a todo', (done)=>{
        var hexId = todos[0]._id.toHexString();
        var text = 'Added from unit test';
        var completed = true;

        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            text,
            completed
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(completed);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });

    it('should clear completedAt when todo is not completed', (done)=>{
        var hexId = todos[1]._id.toHexString();
        var text = 'Added from unit test 1';
        var completed = false;

        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            text,
            completed
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(completed);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);      
    });
 });