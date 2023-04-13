const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv")
const { MongoClient, ServerApiVersion } = require("mongodb");


dotenv.config();
const app = express();
const PORT = 5000 || process.env.PORT;

//middleware 
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    res.send("server success full running")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tlsofwm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try{
    const salaryCollectionData = client
      .db("futurexDB")
      .collection("salaryCollection");


    app.get('/salary', async(req, res) => {
        const query = {}
        const cursor = await salaryCollectionData.find(query).toArray();
        res.send(cursor);
    })
  }
  finally{

  }
}
run().catch(console.dir);

app.listen(5000, () => console.log(`server running port is `))


