const mongoose = require("mongoose");
require("dotenv").config();

const connect = mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch(() => {
    console.log("Database cannot be Connected");
  });

// Schema para usuários
const Loginschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Schema para pedidos
const PedidoSchema = new mongoose.Schema({
  cliente: {
    type: String, // nome do cliente
    required: true,
  },
  itens: {
    type: Array, // lista de itens do pedido
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pendente", // status do pedido
  },
  entregue: {
    type: String,
    default: "Pendente", // Sim ou Não
  },
  observacoes: {
    type: String,
    default: "", // observações adicionais do cliente
  },
  dataPagamento: {
    type: Date,
    default: null, // Data do pagamento
  },
  email: {
    type: String,
    required: true, // agora cada pedido precisa ter um email válido
  },
  dataCancelamento: {
    type: Date,
    default: null, // se o pedido foi cancelado
  },
  dataEntrega: {
    type: Date,
    default: null, // data prevista para entrega
  },
});

// Models
const Usuario = mongoose.model("patylogin", Loginschema);
const Pedido = mongoose.model("pedidos", PedidoSchema);

module.exports = { Usuario, Pedido };
