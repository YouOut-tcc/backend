import request from "supertest";
import chai from "chai";
import database from "../src/models/connection.js";
// import app from "../src/index.js"

const expect = chai.expect;
const app = "http://localhost:3333";

const conn = await database.connect();

let tokenPlace = undefined;

let erroLogin = false;
let erroCadastro = false;
let backendOnline = true;

// beforeEach(function () {
//   if (this.currentTest.parent.tests.some((test) => test.state === "failed"))
//     this.skip(); // Skip subsequent tests if the describe block failed
// });

function checkErrors(err, done) {
  if (err) {
    // console.log(err.constructor.name);
    if (err instanceof AggregateError) {
      if (err.errors[0].code == "ECONNREFUSED") {
        backendOnline = false;
        return done(err.errors[0]);
      }
    }
    done(err);
  }
}

describe("ENDPOINTS /estabelecimentos", () => {

  before(async (done) => {
    await conn.beginTransaction(function (err) {
      if (err) throw err;
      done();
    });
  })

  beforeEach(function () {

    if (!backendOnline)
      this.skip();
  });

  after((done) => {
    conn.rollback();
    conn.end();
    done();
  })

  describe("Iniciado o login e place inicial", () => {
    const login = {
      email: "teste@teste.teste",
      password: "testeteste",
    };

    const cadastro = {
      name: "Teste",
      email: "teste@teste.teste",
      password: "testeteste",
    };

    it("Cadastro de um login", (done) => {
      request(app)
        .post("/estabelecimento/cadastro")
        .send(cadastro)
        .end((err, res) => {
          checkErrors(err, done);

          expect(res.status).to.equal(200);
          // expect(res.body.message).to.equal('Bem-vindo à API');
          done();
        });
    });

    it("Login de um login", (done) => {
      request(app)
        .get("/estabelecimento/places")
        .set("Authorization", `Bearer ${tokenPlace}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          // expect(res.body.message).to.equal('Bem-vindo à API');
          done();
        });
    });

    xit("Cadastro de um place", (done) => {});

    xit("Verificando se place existe", (done) => {});
  });
  // beforeEach(function () {
  //   if (this.currentTest.parent.tests.some((test) => test.state === "failed"))
  //     this.skip(); // Skip subsequent tests if the describe block failed
  // });

  xit("Criando o primeiro teste", (done) => {
    request("http://localhost:3333")
      .get("/estabelecimento/places")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmZvVXNlciI6eyJpZCI6MSwidXNlck5hbWUiOiJDYXJsb3MiLCJlbWFpbCI6ImVAZS5lIiwidXNlclR5cGUiOiJ1c2VyIn0sImlhdCI6MTY5ODE3MjU1MSwiZXhwIjoxNjk4MTkwNTUxfQ.oWAh5XcTbdSlyc3VaTEVsiUOTrkDD9nfhSgqO2WG_-k`
      )
      .end((err, res) => {
        expect(res.status).to.equal(200);
        // expect(res.body.message).to.equal('Bem-vindo à API');
        done();
      });
  });

  xit("Cadastro ero", function (done) {
    if (erroCadastro == true) {
      return this.skip();
    }
    request("http://localhost:3333")
      .post("/estabelecimento/cadastro")
      .end((err, res) => {
        erroCadastro = true;
        expect(res.status).to.equal(200);
        if (err) {
          erroCadastro = true;
        }

        done();
      });
  });

  xit("Cadastro ero2", function (done) {
    if (erroCadastro == true) {
      this.skip();
    }
    request("http://localhost:3333")
      .post("/estabelecimento/cadastro")
      // .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmZvVXNlciI6eyJpZCI6MSwidXNlck5hbWUiOiJDYXJsb3MiLCJlbWFpbCI6ImVAZS5lIiwidXNlclR5cGUiOiJ1c2VyIn0sImlhdCI6MTY5ODE3MjU1MSwiZXhwIjoxNjk4MTkwNTUxfQ.oWAh5XcTbdSlyc3VaTEVsiUOTrkDD9nfhSgqO2WG_-k`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        // expect(res.body.message).to.equal('Bem-vindo à API');
        done();
      });
  });
});
