const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {Users} = require('./../models/user');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

 describe('GET /users/me', ()=>{
     it('should return user if authenticated', (done)=>{
         request(app)
         .get('/users/me')
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .expect((res)=>{
            expect((res.body._id)).toBe(users[0]._id.toHexString());
            expect((res.body.email)).toBe(users[0].email);
         })
         .end(done);
     });

     it('should return 401 if user is not authenticated', (done)=>{
         request(app)
         .get('/users/me')
         .expect(401)
         .expect((res)=>{
             expect(res).toNotEqual(users[0]); 
         })
         .end(done);
    });

 });

 describe('GET /users', ()=>{
    it('should return a user', (done) =>{
        var email = 'nunicorn@gmail.com';
        var password = 'babyfin';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err)=>{
            if(err){
                return done(err);
            }

            Users.findOne({email}).then((user)=>{
                expect(user).toExist();
                expect(user.email).toBe(email);
                expect(user.password).toNotBe(password);
                done();
            })
        });

     });

    it('should throw a validation error if info is invalid', (done) =>{
        var email = 'sushi';
        var password = 'baby';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });

    it('should not create user if email is in use', (done) =>{
        var email = users[0].email;
        var password = 'forgotIregistered';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);

    });

 });