import request from "supertest";
import chai from "chai";

const expect = chai.expect;


// teste das endpoints de um estabelecimentos
// passar por todas a endpoints

describe("Teste inicial de cadastro e login", () => {
  let erroLogin = false;
  let erroCadastro= false;
  // beforeEach(function () {
  //   if (this.currentTest.parent.tests.some((test) => test.state === "failed"))
  //     this.skip(); // Skip subsequent tests if the describe block failed
  // });

  it("Criando o primeiro teste", (done) => {
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

  it("Cadastro ero", (done) => {
    console.log(erroCadastro)
    if(erroCadastro == false){
      return this.skip();
    }
    request("http://localhost:3333")
      .post("/estabelecimento/cadastro")
      // .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmZvVXNlciI6eyJpZCI6MSwidXNlck5hbWUiOiJDYXJsb3MiLCJlbWFpbCI6ImVAZS5lIiwidXNlclR5cGUiOiJ1c2VyIn0sImlhdCI6MTY5ODE3MjU1MSwiZXhwIjoxNjk4MTkwNTUxfQ.oWAh5XcTbdSlyc3VaTEVsiUOTrkDD9nfhSgqO2WG_-k`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        if(err){
        erroCadastro = true;

        }
        erroCadastro = true;
        // expect(res.body.message).to.equal('Bem-vindo à API');
        erroCadastro = true;
        done();
      });
  });

  it("Cadastro ero2", function(done){
    console.log(erroCadastro)
    if(erroCadastro==false){
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
