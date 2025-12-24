/* global describe, it, expect */
import request from "supertest";
import app from "#src/app.js";

describe("API Endpoints", () => {
  describe("GET /health", () => {
    it("should return status OK with timestamp and uptime", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toHaveProperty("status", "OK");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("uptime");
    });
  });

  describe("GET /api", () => {
    it("should return API message", async () => {
      const response = await request(app).get("/api").expect(200);

      expect(response.body).toHaveProperty(
        "message",
        "Dollopix API is running",
      );
    });
  });

  describe("GET /non-existent", () => {
    it("should return 404 for unknown routes", async () => {
      const response = await request(app).get("/non-existent").expect(404);
      expect(response.body).toHaveProperty("error", "Route not found");
    });
  });
});
