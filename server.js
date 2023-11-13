require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit("pronto");
  })
  .catch((e) => console.log(e));

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const routes = require("./routes");
const path = require("path");

const helmet = require("helmet");
const csrf = require("csurf");

const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require("./src/middlewares/middleware");

//         Criar   Ler   Atualizar   Apagar
// CRUD -> CREATE, READ, UPDATE,     DELETE
//         POST    GET   PUT         DELETE

// http://meusite.com/ <- GET -> Entregue a página /
// http://meusite.com/sobre <- GET -> Entregue a página /sobre
// http://meusite.com/contato <- GET -> Entregue a página /contato

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
// utilizado para tratar as requisições
app.use(express.json())
app.use(express.static(path.resolve(__dirname, "public")));

const sessionOptions = session({
  secret: "gfjgadogaer-aertjgadsioghdfi-rgjreg-rgjçasaegf",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});
app.use(sessionOptions);
app.use(flash());

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(csrf());

//Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

app.on("pronto", () => {
  app.listen(3000, () => {
    console.log("Acessar link: http://localhost:3000");
    console.log("Servidor executando na porta 3000");
  });
});
