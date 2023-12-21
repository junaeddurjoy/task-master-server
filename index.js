const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(express.json());
// app.use(cors());

// mongo default


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.schfv1q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const taskCollection = client.db('task-master').collection('task');

        // get all result
        app.get('/task', async (req, res) => {
            const cursor = taskCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // add task
        app.post('/task', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        })

        // delete task
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        });



        // update my jobs
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedApply = req.body;
            const apply = {
                $set: {
                    title: updatedApply.title,
                    description: updatedApply.description,
                    deadline: updatedApply.deadline,
                    priority: updatedApply.priority,
                    status: updatedApply.status,
                    email: updatedApply.email
                }
            }
            const result = await taskCollection.updateOne(filter, apply, options);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('hehhe boiiiii')
})

app.listen(port, () => {
    console.log(`server running ${port}`)
})