const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express()


// midleware 
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8tifwil.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{

        const moviesCollection = client.db("movies").collection("movie")

        // POST api to save a movie into database

        app.post("/add-movie", async(req, res)=>{
            const movie = req.body;
            const result = await moviesCollection.insertOne(movie);
            res.send(result);
        })


        // fetch all the movies stores in the database

        app.get("/get-all", async(req, res)=>{
            const query = {}
            const result = await moviesCollection.find(query).toArray();
            res.send(result)
        })

        // fetch single movie stores in the database 
        
        app.get("/get-single/:id", async(req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await moviesCollection.findOne(query);
            res.send(result);
        })

        // fetch movies using pagination 

        app.get('/products', async(req, res)=>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = moviesCollection.find(query)
            const products = await cursor.skip(page*size).limit(size).toArray()
            const count = await moviesCollection.estimatedDocumentCount()
            res.send({count, products})

        });



    }
    finally{

    }
}

run().catch(err=> console.error(err))

app.get('/', (req, res)=>{
    res.send("Movie server is running ")
})

app.listen(port, ()=>{
    console.log(`i am running on port ${port}`)
})