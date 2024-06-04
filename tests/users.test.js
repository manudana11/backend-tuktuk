const request = require('supertest');
const app = require('../index.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;
const User = require('../models/User.js');
const Post = require('../models/Post.js');
const Comment = require('../models/Comment.js');

describe("Testing Endpoints", () => {
    afterAll(async () => {
        return await User.deleteMany(), Post.deleteMany(), Comment.deleteMany();
    });

    const user = {
        name: "Test1",
        userName: "usuariotesteado1",
        email: "sebas33696@gmail.com",
        password: "contra123",
        dateOfBirth: "1990-01-01",

    };
    const user2 = {
        name: "user2",
        userName: "usuariotesteado2",
        email: "sebas.barrientos@hotmail.com",
        password: "contra123",
        dateOfBirth: "1990-01-02",

    };
    let token
    let token2
    const post = {
        caption: "Foto en las playas de Cancun",
        location: "Cancun"
    };
    const comment = {
        bodyText: "Que lindo lugar!!"
    }

    test("Create a user", async () => {
        const res = await request(app).post("/users").send(user).expect(201)
        const expectedResult = {
            ...user,
            _id: res.body._id,
            password: res.body.password,
            __v: res.body.__v,
            followers: res.body.followers,
            following: res.body.following,
            posts: res.body.posts,
            comments: res.body.comments,
            likes: res.body.likes,
            role: res.body.role,
            confirmed: res.body.confirmed,
            dateOfBirth: res.body.dateOfBirth,
            createdAt: res.body.createdAt,
            updatedAt: res.body.updatedAt,
        };
        const newUser = res.body;
        expect(newUser).toEqual(expectedResult);

    });
    test("Create a second user", async () => {
        const res = await request(app).post("/users").send(user2).expect(201)
        const expectedResult = {
            ...user2,
            _id: res.body._id,
            password: res.body.password,
            __v: res.body.__v,
            followers: res.body.followers,
            following: res.body.following,
            posts: res.body.posts,
            comments: res.body.comments,
            likes: res.body.likes,
            role: res.body.role,
            confirmed: res.body.confirmed,
            dateOfBirth: res.body.dateOfBirth,
            createdAt: res.body.createdAt,
            updatedAt: res.body.updatedAt,
        };
        const newUser = res.body;
        expect(newUser).toEqual(expectedResult);
        user2._id = res.body._id
    });
    test("confirm user1 Email", async () => {
        const res = await request(app).put("/users/confirm/" + user.email).expect(201)
        expect(res.body.message).toBe("User confirmed successfully")
    })
    test("confirm user2 Email", async () => {
        const res = await request(app).put("/users/confirm/" + user2.email).expect(201)
        expect(res.body.message).toBe("User confirmed successfully")
    })

    test("Login user 1", async () => {
        const res = await request(app)
            .post("/users/login")
            .send({ email: "sebas33696@gmail.com", password: "contra123" })
            .expect(200)
        expect(res.body.message).toBe('Welcome ' + user.name);
        token = res.body.token;
    })
    test("Login user 2", async () => {
        const res = await request(app)
            .post("/users/login")
            .send({ email: "sebas.barrientos@hotmail.com", password: "contra123" })
            .expect(200)
        expect(res.body.message).toBe('Welcome ' + user2.name);
        token2 = res.body.token;
    })
    test("Update userinfo", async () => {
        const updateUser = {
            name: "Sebastian",
        };
        const res = await request(app)
            .put("/users")
            .send(updateUser)
            .set({ Authorization: token })
            .expect(200);
        expect(res.body.message).toBe("user successfully updated");
    });
    test("Search user´s info", async () => {
        const res = await request(app)
            .get("/users")
            .set({ Authorization: token })
            .expect(200);
        expect(res.body.message).toBe("Your information:");
    });
    test("Search all users", async () => {
        const res = await request(app)
            .get("/users/getAll")
            .set({ Authorization: token })
            .expect(200);
        expect(res.body.message).toBe("Users");
    })
    
    test("Search a user by id", async () => {
        const res = await request(app)
            .get("/users/id/"+user2._id)
            .set({ Authorization: token })
            .expect(200);
        expect(res.body.message).toBe("user:");
    });
    test("Search a user by name", async () => {
        const res = await request(app)
            .get("/users/getByName/?name=user2")
            .set({ Authorization: token })
            .expect(200);
        expect(res.body.message).toBe("user:");
    });
    test("Follow a user", async () => {
        const res = await request(app)
            .put("/users/follow/"+user2._id)
            .set({ Authorization: token })
            .expect(200);
        expect(res.body.message).toBe("You successfully followed ");
    });
    test("Unfollow a user", async () => {
        const res = await request(app)
            .put("/users/unfollow/"+user2._id)
            .set({ Authorization: token })
            .expect(200);
        expect(res.body.message).toBe("You successfully unfollowed ");
    });
    test("Logout a user", async () => {
        const res = await request(app)
            .delete("/users/logout")
            .set({ Authorization: token })
            .expect(200);
        expect(res.body.message).toBe("Disconected succesfully");
    });
})