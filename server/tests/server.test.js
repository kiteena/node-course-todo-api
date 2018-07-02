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
        .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });

});

describe('Get /todos/:id', ()=>{
    it('should return a todo doc', (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done)=>{
        let badId ='123';
        request(app)
        .get(`/todos/${badId}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should not return a todo doc created by another user', (done)=>{
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
    
});

describe('DELETE /todos/:id', ()=>{
    it('should delete a todo', (done)=>{
        var hexId = todos[1]._id.toHexString();
        
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.findById(hexId).then((todo)=>{
                expect(todo).toBeFalsy();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not delete a todo if not the creator', (done)=>{
        var hexId = todos[0]._id.toHexString();
        
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.findById(hexId).then((todo)=>{
                expect(todo).toBeTruthy();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return 404 if todo was not found', (done)=>{
        let newId = new ObjectID();
        request(app)
        .delete(`/todos/${newId.toHexString()}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id was invalis', (done)=>{
        let badId ='123';
        request(app)
        .delete(`/todos/${badId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });
 });

 describe('PATCH /todos/:id',()=>{
    it('should update a todo', (done)=>{
        var hexId = todos[1]._id.toHexString();
        var text = 'Added from unit test';
        var completed = true;

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
            text,
            completed
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(completed);
            expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(done);
    });

    it('should not update a todo if not the creator', (done)=>{
        var hexId = todos[0]._id.toHexString();
        var text = 'Added from unit test';
        var completed = true;

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
            text,
            completed
        })
        .expect(404)
        .expect((res)=>{
            expect(res.body.todo).toBeFalsy();
        })
        .end(done);
    });

    it('should clear completedAt when todo is not completed', (done)=>{
        var hexId = todos[1]._id.toHexString();
        var text = 'Added from unit test 1';
        var completed = false;

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
            text,
            completed
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId);
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(completed);
            expect(res.body.todo.completedAt).toBeFalsy();
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
             expect(res).not.toEqual(users[0]); 
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
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        })
        .end((err)=>{
            if(err){
                return done(err);
            }

            Users.findOne({email}).then((user)=>{
                expect(user).toBeTruthy();
                expect(user.email).toBe(email);
                expect(user.password).not.toBe(password);
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

 describe('POST /users/login', ()=>{
    it('should login user and return auth token', (done)=>{
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res)=>{
            if(err) {
                return done(err);
            }

            Users.findOne(users[1]._id).then((user)=>{
                expect(user.tokens[1].toObject()).toMatchObject({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            })
        });
    });

    it('should reject invalid login', (done)=>{
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: '!password'
        })
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeFalsy();
        })
        .end((err, res)=>{
            if(err) {
                return done(err);
            }

            Users.findOne(users[1]._id).then((user)=>{
                expect(user.tokens.length).toBe(1); 
                done();
            });
        });
    });
 });

 describe('DELETE /users/me/token', ()=>{
     it('should remove auth token on logout', (done)=>{
        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err, res)=>{
            if(err){
                return done(err);
            }
            Users.findOne(users[0]._id).then((user)=>{
                expect(user.tokens[0]).toBeFalsy();
                expect(user.tokens.length).toBe(0); 
                done();
            }).catch((e)=> done(e));
        });
     });
 });