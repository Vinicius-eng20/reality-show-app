const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb+srv://cluster01.evzsyzf.mongodb.net";
const client = new MongoClient(uri);

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  await client.connect();
  const db = client.db("reality");

  const showsColl = db.collection("shows");
  const premiosColl = db.collection("premios");
  const premiosPartColl = db.collection("premios_participantes");

  await showsColl.deleteMany({});
  await premiosColl.deleteMany({});
  await premiosPartColl.deleteMany({});

  // Create 50 prizes
  const premios = [];
  for (let i = 1; i <= 50; i++) {
    premios.push({
      descricao: `Prêmio ${i}`,
      valor: random(1000, 200000),
    });
  }
  const insertedPremios = await premiosColl.insertMany(premios);

  // Create 3 reality shows with 10 participants
  const showNames = ["Desafio Final", "Casa do Caos", "Ilha da Verdade"];
  const shows = [];

  for (let s = 0; s < 3; s++) {
    const participantes = [];
    for (let p = 1; p <= 10; p++) {
      participantes.push({
        _id: new ObjectId(),
        nome: `Participante ${s + 1}-${p}`,
        idade: random(18, 60),
        total_votos: 0,
        eliminado: false
      });
    }

    shows.push({
      nome: showNames[s],
      emissora: `Emissora ${s + 1}`,
      audiencia_pontos: random(10, 40),
      participantes
    });
  }

  const insertedShows = await showsColl.insertMany(shows);

  // Deliver random prizes
  const premiosEntregues = [];

  for (let i = 0; i < 20; i++) {
    const showKeys = Object.values(insertedShows.insertedIds);
    const premioKeys = Object.values(insertedPremios.insertedIds);

    const show_id = showKeys[random(0, showKeys.length - 1)];
    const showDoc = await showsColl.findOne({ _id: show_id });
    
    const partic = showDoc.participantes[random(0, 9)]._id;
    const premio = premioKeys[random(0, premioKeys.length - 1)];

    premiosEntregues.push({
      id_show: show_id,
      id_participante: partic,
      id_premio: premio,
      data: new Date()
    });
  }

  await premiosPartColl.insertMany(premiosEntregues);

  console.log("SEED COMPLETO!");
  process.exit();
}

seed();
