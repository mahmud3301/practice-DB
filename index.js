const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mahmud.mxmnc58.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const chocolatesCollection = client.db("chocolates").collection("chocolates");

        app.post('/chocolates', async (req, res) => {
            const newChocolates = req.body;
            console.log(newChocolates);
            const result = await chocolatesCollection.insertOne(newChocolates);
            res.send(result);
        })

        app.get('/chocolates', async (req, res) => {
            const query = {};
            const cursor = chocolatesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/chocolates/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:new ObjectId(id) };
            const result = await chocolatesCollection.deleteOne(query);
            res.send(result);
        })
        app.get('/chocolates/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id:new ObjectId(id) };
            const result = await chocolatesCollection.findOne(query);
            res.send(result);
        })

        app.put('/chocolates/:id', async (req, res) => {
            const id = req.params.id;
            const updatedChocolates = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedChocolates.name,
                    country: updatedChocolates.country,
                    category: updatedChocolates.category,
                    Image: updatedChocolates.Image
                }
            };
            const result = await chocolatesCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });


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
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})