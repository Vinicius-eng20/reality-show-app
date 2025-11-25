const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb+srv://cluster01.evzsyzf.mongodb.net";

let db;

async function connect() {
  if (db) return db;

  const client = new MongoClient(uri);
  await client.connect();
  db = client.db("reality");

  console.log("Conectado ao MongoDB Atlas!");
  return db;
}

module.exports = connect;
