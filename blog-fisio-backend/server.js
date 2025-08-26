const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Banco de dados SQLite (arquivo local)
const db = new sqlite3.Database("./blog.db");

// Criar tabela de posts se não existir
db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    resumo TEXT,
    conteudo TEXT,
    categoria TEXT,
    imagem TEXT,
    data TEXT
)`);

// Rota: Listar posts
app.get("/posts", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY id DESC", [], (err, rows) => {
    if (err) res.status(500).json(err);
    else res.json(rows);
  });
});

// Rota: Obter post específico
app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json(err);
    if (!row) return res.status(404).json({ message: "Post não encontrado" });
    res.json(row);
  });
});

// Rota: Criar post
app.post("/posts", (req, res) => {
  const { titulo, resumo, conteudo, categoria, imagem } = req.body;
  const data = new Date().toISOString().split("T")[0];

  db.run(
    `INSERT INTO posts (titulo, resumo, conteudo, categoria, imagem, data) VALUES (?, ?, ?, ?, ?, ?)`,
    [titulo, resumo, conteudo, categoria, imagem, data],
    function (err) {
      if (err) res.status(500).json(err);
      else res.json({ id: this.lastID });
    }
  );
});

// Rota: Editar post
app.put("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, resumo, conteudo, categoria, imagem } = req.body;

  db.run(
    `UPDATE posts SET titulo=?, resumo=?, conteudo=?, categoria=?, imagem=? WHERE id=?`,
    [titulo, resumo, conteudo, categoria, imagem, id],
    function (err) {
      if (err) res.status(500).json(err);
      else res.json({ updated: this.changes });
    }
  );
});

// Rota: Deletar post
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM posts WHERE id=?`, id, function (err) {
    if (err) res.status(500).json(err);
    else res.json({ deleted: this.changes });
  });
});

app.listen(3000, () =>
  console.log("🚀 Servidor rodando em http://localhost:3000")
);
