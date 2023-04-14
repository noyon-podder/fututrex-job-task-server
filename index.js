const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv")
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


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

    app.post("/add-employee", async(req, res) => {
      const employee = req.body;
      const cursor = await salaryCollectionData.insertOne(employee);
      res.send(cursor);

    })

    app.get("/employee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await salaryCollectionData.findOne(query);
      res.send(result);
    });

    app.put("/employee/:id", async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)}
      const user = req.body;
      const options = {upsert: true}
      const updatedUser = {
        $set:{
          firstName: user.firstName,
          lastName: user.lastName,
          salary: user.salary,
          date: user.date,
          email: user.email
        }
      }
      const cursor = await salaryCollectionData.updateOne(
        filter,
        updatedUser, options
      );
      res.send(cursor)
    })

    app.delete("/employee-delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await salaryCollectionData.deleteOne(query);
      res.send(result);
    })
    
  }
  finally{

  }
}
run().catch(console.dir);

app.listen(5000, () => console.log(`server running port is `))


