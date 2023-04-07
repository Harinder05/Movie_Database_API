const request = require("supertest");
const app = require("../app");

describe("Getting a movie with ID", () => {
    it("should return the movie matching with the ID", async () => {
      const res = await request(app.callback())
        .get("/api/v1/movies/6400e7bcd6cc7e99f0f9eacc")
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("_id", "6400e7bcd6cc7e99f0f9eacc");
    });
  });


  describe("Getting all movies in DB", () => {
    it("should return all movies in db", async () => {
      const res = await request(app.callback())
        .get("/api/v1/movies")
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      const movie=res.body[0]
      expect(movie).toHaveProperty("_id")
      expect(movie).toHaveProperty("title")
      expect(movie).toHaveProperty("description")
      expect(movie).toHaveProperty("releaseDate")
      expect(movie).toHaveProperty("director")
      expect(movie).toHaveProperty("cast")
      expect(movie).toHaveProperty("createdBy")
      expect(movie).toHaveProperty("updatedBy")
    });
  });

  describe("Searching by Title", () => {
    it("should return the movie matching with the input title", async () => {
      const res = await request(app.callback())
        .get("/api/v1/movies/search/Ince")
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1)
      const movie=res.body[0]
      expect(movie).toHaveProperty("_id")
      expect(movie).toHaveProperty("title")
      expect(movie).toHaveProperty("description")
      expect(movie).toHaveProperty("releaseDate")
      expect(movie).toHaveProperty("director")
      expect(movie).toHaveProperty("cast")
      expect(movie).toHaveProperty("createdBy")
      expect(movie).toHaveProperty("updatedBy")
    });
  });