require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(bodyParser.json());
app.use(morgan("combined"));

// Conexão com MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao MySQL:", err);
    process.exit(1);
  }
  console.log("✅ Conectado ao MySQL");
});

// Middleware de autenticação JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Não autorizado" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

// Login retorna token
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === process.env.ADMIN_USER && senha === process.env.ADMIN_PASS) {
    const token = jwt.sign({ usuario }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return res.json({ token });
  }

  res.status(401).json({ message: "Usuário ou senha incorretos" });
});

// Rotas públicas
app.get("/posts", (req, res) => {
  db.query("SELECT * FROM posts ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM posts WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (!result.length)
      return res.status(404).json({ message: "Post não encontrado" });
    res.json(result[0]);
  });
});

// Rotas protegidas (JWT)
app.post("/posts", authMiddleware, (req, res) => {
  const { titulo, resumo, conteudo, categoria, imagem } = req.body;
  const data = new Date().toISOString().split("T")[0];
  db.query(
    "INSERT INTO posts (titulo, resumo, conteudo, categoria, imagem, data) VALUES (?, ?, ?, ?, ?, ?)",
    [titulo, resumo, conteudo, categoria, imagem, data],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
});

app.put("/posts/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { titulo, resumo, conteudo, categoria, imagem } = req.body;
  db.query(
    "UPDATE posts SET titulo=?, resumo=?, conteudo=?, categoria=?, imagem=? WHERE id=?",
    [titulo, resumo, conteudo, categoria, imagem, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ updated: result.affectedRows });
    }
  );
});

app.delete("/posts/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM posts WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ deleted: result.affectedRows });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);
