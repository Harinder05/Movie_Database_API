const request = require("supertest");
const app = require("../app");
// Register Tests
describe("Create new user", () => {
  it("should create a new user", async () => {
    const res = await request(app.callback())
      .post("/api/v1/user/register")
      .send({
        name: "user8",
        email: "user8@gmail.com",
        password: "user8",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toHaveProperty("created", true);
  });
});

describe("Fail create new user", () => {
  it("should not create a new user becasue email used already", async () => {
    const res = await request(app.callback())
      .post("/api/v1/user/register")
      .send({
        name: "user1",
        email: "user1@gmail.com",
        password: "user1",
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty("message", "Email already used. Please register with different email");
  });
});
// Login Tests
describe("User login", () => {
  it("should log the user", async () => {
    const res = await request(app.callback())
    .post("/api/v1/user/login")
    .send({
      email: "user1@gmail.com",
      password: "user1",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("Login successful. TOKEN:");
  });
});

describe("User login", () => {
  it("should not log the user because wrong password", async () => {
    const res = await request(app.callback())
    .post("/api/v1/user/login")
    .send({
      email: "user1@gmail.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Password not correct.");
  });
});

describe("User login test", () => {
  it("should not log the user because email is not registerd", async () => {
    const res = await request(app.callback())
    .post("/api/v1/user/login")
    .send({
      email: "dhsfhdsfh@gmail.com",
      password: "user1",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "message",
      "This email is not registered. Please register!"
    );
  });
});