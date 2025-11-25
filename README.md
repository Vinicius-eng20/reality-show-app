# Reality Show App (MongoDB + Node.js)

Aplicação completa para gerenciamento de um *reality show*, incluindo:

- Cadastro de reality shows  
- Participantes embutidos dentro de cada show  
- Catálogo de prêmios  
- Registro de prêmios recebidos pelos participantes  
- Endpoints de consulta (como solicitado no exercício)  
- Página de votação com gráfico atualizado  
- Banco de dados totalmente hospedado no MongoDB Atlas  

---

## 📁 Estrutura do Projeto
```
reality-show-app/
│
├── server.js
├── package.json
│
├── config/
│ └── db.js
│
├── models/
│ ├── showSchema.json
│ ├── participanteSchema.json
│ └── premioSchema.json
│
├── data/
│ ├── seed.js
│ ├── shows.json
│ ├── participantes.json
│ └── premios.json
│
├── public/
│ ├── index.html
│ ├── votar.html
│ ├── chart.js
│ └── css/
│ └── style.css
```

---

## 🚀 1. **Pré-requisitos**

Antes de começar, você precisa:

- Node.js instalado  
- Conta no **MongoDB Atlas**  
- Ter criado:
  - Projeto
  - Cluster M0
  - Usuário do banco
  - IP liberado (`0.0.0.0/0`)
- Ter obtido sua string de conexão (exemplo):
    mongodb+srv://usuario:senha@cluster01.abc123.mongodb.net/

---

## 📦 2. Instalação

No diretório do projeto:

```bash
npm install
```

## 🗄️ 3. Configuração da Conexão com o MongoDB
Edite em server.js ou config/db.js a linha:


``` js
const uri = "MONGODB_ATLAS_CONNECTION";
```

Substitua por:
```
mongodb+srv://<usuario>:<senha>@cluster01.<id>.mongodb.net/
```

## 🌱 4. Executando o Script de Seed
Esse script cria:

✔ 3 reality shows
✔ 10 participantes cada
✔ 50 prêmios
✔ relações de prêmios entregues

Execute:

```bash
node data/seed.js
```

Se aparecer:

```
SEED COMPLETO!
```

✓ Banco populado com sucesso.

## ▶️ 5. Executando o Servidor

```bash
node server.js

```

```
Servidor rodando em: http://localhost:3000
```

## 🌐 6. Endpoints Disponíveis
### 🔸 GET /premios
Retorna:
- Shows
- Participantes
- Prêmios recebidos

### 🔸 GET /idade/:nome_reality
Retorna:

Participante mais novo

Participante mais velho

### 🔸 GET /maior/:valor
Retorna:

Realities onde alguém ganhou prêmio com valor ≥ parâmetro

### 🔸 GET /total
Retorna:

Quantidade total de prêmios por reality show

### 🔸 GET /audiencia
Retorna:

Emissoras e soma da audiência dos seus realities

### 🔸 POST /votar
Body:

```json

{
  "show_id": "...",
  "participante_id": "..."
}
```
Incrementa voto do participante.

### 🔸 GET /votos/:show_id
Retorna lista de participantes com votos (para uso no gráfico).

## 🗳️ 7. Página de Votação
Abra:

```bash
http://localhost:3000/votar.html?show=<id_do_show>
```
A página exibe:

- Select com participantes
- Botão de votar
- Gráfico de votos em tempo real 

## 🧪 8. Testando com Insomnia/Postman

``` bash
POST http://localhost:3000/votar
{
  "show_id": "64eabf9df91...",
  "participante_id": "64eabfa2c71..."
}
```