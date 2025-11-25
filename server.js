const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const uri = "mongodb+srv://cluster01.evzsyzf.mongodb.net";
const client = new MongoClient(uri);
let db, shows, premios, premios_part;

async function start() {
  await client.connect();
  db = client.db("reality");
  shows = db.collection("shows");
  premios = db.collection("premios");
  premios_part = db.collection("premios_participantes");

  console.log("MongoDB conectado!");
}

start();

// shows + participantes + premios entregues
app.get("/premios", async (req, res) => {
  const data = await premios_part.aggregate([
    {
      $lookup: {
        from: "shows",
        localField: "id_show",
        foreignField: "_id",
        as: "show"
      }
    },
    { $unwind: "$show" },
    {
      $lookup: {
        from: "premios",
        localField: "id_premio",
        foreignField: "_id",
        as: "premio"
      }
    },
    { $unwind: "$premio" }
  ]).toArray();

  res.json(data);
});

// participante mais novo/velho
app.get("/idade/:nome_reality", async (req, res) => {
  const show = await shows.findOne({ nome: req.params.nome_reality });

  if (!show) return res.status(404).json({ error: "Reality não encontrado" });

  const sorted = show.participantes.sort((a, b) => a.idade - b.idade);

  res.json({
    reality: show.nome,
    mais_novo: sorted[0],
    mais_velho: sorted[sorted.length - 1]
  });
});

// realities com premio >= valor
app.get("/maior/:valor", async (req, res) => {
  const valor = Number(req.params.valor);

  const data = await premios_part.aggregate([
    {
      $lookup: {
        from: "premios",
        localField: "id_premio",
        foreignField: "_id",
        as: "premio"
      }
    },
    { $unwind: "$premio" },
    { $match: { "premio.valor": { $gte: valor } } },
    {
      $lookup: {
        from: "shows",
        localField: "id_show",
        foreignField: "_id",
        as: "show"
      }
    },
    { $unwind: "$show" }
  ]).toArray();

  res.json(data);
});

// total de prêmios por reality
app.get("/total", async (req, res) => {
  const data = await premios_part.aggregate([
    {
      $group: {
        _id: "$id_show",
        total_premios: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "shows",
        localField: "_id",
        foreignField: "_id",
        as: "show"
      }
    },
    { $unwind: "$show" }
  ]).toArray();

  res.json(data);
});

// total de audiência por emissora
app.get("/audiencia", async (req, res) => {
  const data = await shows.aggregate([
    {
      $group: {
        _id: "$emissora",
        total: { $sum: "$audiencia_pontos" }
      }
    }
  ]).toArray();

  res.json(data);
});

// adiciona votos
app.post("/votar", async (req, res) => {
  const { show_id, participante_id } = req.body;

  await shows.updateOne(
    { _id: new ObjectId(show_id), "participantes._id": new ObjectId(participante_id) },
    { $inc: { "participantes.$.total_votos": 1 } }
  );

  res.json({ message: "Voto contabilizado!" });
});

// retorna votos de participantes
app.get("/votos/:show_id", async (req, res) => {
  const show = await shows.findOne({ _id: new ObjectId(req.params.show_id) });
  res.json(show.participantes);
});

app.get("/shows", async (req, res) => {
  const lista = await shows.find({}).toArray();
  res.json(lista);
});


app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
