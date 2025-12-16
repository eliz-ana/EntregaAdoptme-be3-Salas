import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://localhost:8080");

function buildTestUser() {
  const unique = Date.now();
  return {
    first_name: "Test",
    last_name: "User",
    email: `test${unique}@mail.com`,
    password: "coder123",
  };
}

function getCookieFrom(res) {
  const raw = res.headers["set-cookie"]?.[0];
  expect(raw, "No vino set-cookie en la respuesta").to.exist;

  // "coderCookie=xxxxx; Path=/; HttpOnly; ..."
  return raw.split(";")[0]; // coderCookie=xxxxx
}

describe("Sessions API", () => {
  describe("POST /api/sessions/register", () => {
    it("debe devolver 400 si faltan campos obligatorios", async () => {
      const res = await requester.post("/api/sessions/register").send({
        first_name: "Ana",
        email: "a@a.com",
        password: "123",
        // falta last_name
      });

      expect(res.status).to.equal(400);
    });

    it("debe devolver 201 si registra correctamente", async () => {
      const newUser = buildTestUser();

      const res = await requester.post("/api/sessions/register").send(newUser);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("status", "success");
      expect(res.body).to.have.property("payload");
      expect(res.body.payload).to.exist; // _id
    });

    it("debe devolver 409 si el email ya existe", async () => {
      const newUser = buildTestUser();

      const first = await requester.post("/api/sessions/register").send(newUser);
      expect(first.status).to.equal(201);

      const second = await requester.post("/api/sessions/register").send(newUser);
      expect(second.status).to.equal(409);
    });
  });

  describe("POST /api/sessions/login", () => {
    it("debe devolver 400 si faltan credenciales", async () => {
      const res = await requester.post("/api/sessions/login").send({
        email: "",
        password: "",
      });

      expect(res.status).to.equal(400);
    });

    it("debe devolver 404 si el usuario no existe", async () => {
      const res = await requester.post("/api/sessions/login").send({
        email: "noexiste@mail.com",
        password: "coder123",
      });

      expect(res.status).to.equal(404);
    });

    it("debe devolver 400 si la password es incorrecta", async () => {
      const newUser = buildTestUser();
      const reg = await requester.post("/api/sessions/register").send(newUser);
      expect(reg.status).to.equal(201);

      const res = await requester.post("/api/sessions/login").send({
        email: newUser.email,
        password: "wrongpass",
      });

      expect(res.status).to.equal(400);
    });

    it("debe loguear y setear cookie coderCookie", async () => {
      const newUser = buildTestUser();
      const reg = await requester.post("/api/sessions/register").send(newUser);
      expect(reg.status).to.equal(201);

      const res = await requester.post("/api/sessions/login").send({
        email: newUser.email,
        password: newUser.password,
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body).to.have.property("message", "Logged in");

      const cookie = getCookieFrom(res);
      expect(cookie).to.match(/^coderCookie=/);
    });
  });

  describe("GET /api/sessions/current", () => {
    it("debe devolver 401 si no hay cookie", async () => {
      const res = await requester.get("/api/sessions/current");
      expect(res.status).to.equal(401);
    });

    it("debe devolver 403 si la cookie es inválida", async () => {
      const res = await requester
        .get("/api/sessions/current")
        .set("Cookie", "coderCookie=token_invalido");

      expect(res.status).to.equal(403);
    });

    it("debe devolver 200 si hay cookie válida y traer payload con user", async () => {
      const newUser = buildTestUser();
      const reg = await requester.post("/api/sessions/register").send(newUser);
      expect(reg.status).to.equal(201);

      const login = await requester.post("/api/sessions/login").send({
        email: newUser.email,
        password: newUser.password,
      });
      expect(login.status).to.equal(200);

      const cookie = getCookieFrom(login);

      const current = await requester
        .get("/api/sessions/current")
        .set("Cookie", cookie);

      expect(current.status).to.equal(200);
      expect(current.body).to.have.property("status", "success");
      expect(current.body).to.have.property("payload");

      // el payload sale del JWT (UserDTO + iat/exp)
      expect(current.body.payload).to.have.property("email", newUser.email);
      expect(current.body.payload).to.have.property("userId");
      expect(current.body.payload).to.have.property("role");
    });
  });
});
