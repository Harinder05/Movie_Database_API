test("Jest should use the test database", () => {
  expect(process.env.MONGODB_URI).toBe("mongodb://localhost/test_db");
});