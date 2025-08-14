
require("dotenv").config(); // para usar variáveis do .env
const express = require("express");
const path = require("path");
const { Usuario, Pedido } = require("./config");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");
const nodemailer = require("nodemailer");


const app = express();

// Middleware para analisar URL encoded
app.use(express.urlencoded({ extended: true }));

// --- Configurar CORS ---
app.use(cors({
  origin: process.env.ORIGIN || "http://localhost:5000", 
  credentials: true
}));

// --- Sessão ---
app.use(session({
  secret: process.env.SECRET || "chave-super-secreta",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 // 1 hora
  }
}));

// Middleware para verificar login
function verificarLogin(req, res, next) {
  if (req.session.usuario) {
    next();
  } else {
    res.redirect("/login");
  }
}

// --- Configurações gerais ---
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("image"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../image")));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
console.log("📧 EMAIL_PASS:", process.env.EMAIL_PASS ? "OK" : "NÃO DEFINIDO");
console.log("📧 EMAIL_OWNER:", process.env.EMAIL_OWNER);


// --- Configurar Nodemailer ---
const transporter = nodemailer.createTransport({
  service: "gmail", // ou outro serviço
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- Rotas ---
app.get("/", (req, res) => {
  res.render("home", { usuario: req.session.usuario || null });
});

app.get("/login", (req, res) => {
  res.render("login", { erro: null });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// Registrar Usuário
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  const existingUser = await Usuario.findOne({ name: data.name });
  if (existingUser) {
    return res.send("Usuário já existe. Escolha outro nome.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  data.password = hashedPassword;

  await Usuario.insertMany(data);
  res.redirect("/login");
});

// Login Usuário
app.post("/login", async (req, res) => {
  try {
    const check = await Usuario.findOne({
      $or: [
        { name: req.body.username },
        { email: req.body.username }
      ]
    });

    if (!check) {
      return res.render("login", { erro: "Usuário ou e-mail não encontrado." });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
    if (!isPasswordMatch) {
      return res.render("login", { erro: "Senha incorreta." });
    }

    req.session.usuario = { name: check.name, email: check.email };
    res.redirect("/");
  } catch (err) {
    console.error("Erro no login:", err);
    res.render("login", { erro: "Erro ao processar login." });
  }
});

// --- Buscar pedidos do usuário logado ---
app.get("/meus-pedidos", async (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json([]);
  }

  try {
    const pedidos = await Pedido.find({ cliente: req.session.usuario.name }).sort({ data: -1 });
    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send("Erro ao sair.");
    }
    res.redirect("/");
  });
});

// --- Salvar Pedido e Enviar E-mail ---
app.post("/pedido", verificarLogin, async (req, res) => {
  try {
    console.log("📦 Dados recebidos no pedido:", req.body);

    const { solicita, total } = req.body;
    if (!solicita || !total) {
      return res.status(400).json({ sucesso: false, mensagem: "Dados inválidos." });
    }

    const novoPedido = new Pedido({
      cliente: req.session.usuario.name,
      email: req.session.usuario.email,
      itens: solicita,
      total: total
    });

    await novoPedido.save();
    console.log("✅ Pedido salvo no banco");

    // Formatar itens para e-mail
    const itensHTML = solicita.map(item =>
      `<li>${item.label} - ${item.qtd}x ${item.tamanho || ""} (R$ ${item.unitPrice.toFixed(2)})</li>`
    ).join("");

    const dataFormatada = new Date().toLocaleString("pt-BR");

    const htmlPedido = `
      <h2>Novo Pedido - ${dataFormatada}</h2>
      <p><strong>Cliente:</strong> ${req.session.usuario.name}</p>
      <p><strong>Email:</strong> ${req.session.usuario.email}</p>
      <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
      <p><strong>Itens:</strong></p>
      <ul>${itensHTML}</ul>
    `;

    // Enviar para o dono
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_OWNER,
      subject: "📦 Novo pedido recebido",
      html: htmlPedido
    });

    // Enviar para o cliente
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.session.usuario.email,
      subject: "📦 Confirmação do seu pedido",
      html: `
        <p>Olá ${req.session.usuario.name},</p>
        <p>Recebemos o seu pedido e já estamos processando.</p>
        ${htmlPedido}
        <p>Obrigado por comprar conosco! 🍰</p>
      `
    });

    res.json({ sucesso: true, mensagem: "Pedido salvo e e-mails enviados com sucesso!" });

  } catch (err) {
    console.error("❌ Erro ao salvar pedido ou enviar e-mail:", err);
    res.status(500).json({ sucesso: false, mensagem: "Erro ao salvar pedido ou enviar e-mail." });
  }
});

// Histórico
app.get("/historico", verificarLogin, async (req, res) => {
  try {
    const pedidos = await Pedido.find({ cliente: req.session.usuario.name }).sort({ data: -1 });
    res.render("historico", { usuario: req.session.usuario, pedidos });
  } catch (err) {
    console.error(err);
    res.send("Erro ao buscar histórico de pedidos.");
  }
});

// Inicia servidor
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando em: http://localhost:${port}`);
});
