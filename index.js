require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 8000;
const dbUri = process.env.DB_URI


// middlewares
app.use(express.json())
app.use(cors())

const client = new MongoClient(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try{
        app.get('/', (req, res) => {
            res.send({message: "This is the root API of TOON TAB application server."});
        })
    }
    finally{

    }
}

run().catch(err => console.error(err));

app.listen(port, ()=> {
    client.connect(err => {
        if(err) console.log(err);
        else console.log('DB connection established')
      });
    console.log(`Server listening on port ${port}`);
});