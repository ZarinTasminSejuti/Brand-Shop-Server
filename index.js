const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// // Middleware
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
// app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.ggegvme.mongodb.net/?retryWrites=true&w=majority`;

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
    const productCollection = client.db('carsDB').collection("cars")
    const myCartCollection = client.db('carsDB').collection("myCart")

    app.get('/addProduct', async (req, res) => {
      const pointer = productCollection.find();
      const result = await pointer.toArray();
      res.send(result); 
}) 


app.post('/addProduct', async (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  const result = await productCollection.insertOne(newProduct);
  res.send(result); 
})
   
    
//my cart section
app.get('/myCart', async (req, res) => {
  const pointer = myCartCollection.find();
  const result = await pointer.toArray();
  res.send(result); 
})

app.post('/myCart', async (req, res) => {
  const newCart = req.body;
  console.log(newCart);
  const result = await myCartCollection.insertOne(newCart);
  res.send(result); 
})
   

    
//Delete
app.delete('/myCart/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const idObject = new ObjectId(itemId)
  console.log(itemId);
  const result = await myCartCollection.deleteOne({ _id: idObject });
  res.send(result);
});
    

    
//update operation
app.get('/updateProduct/:_id', async (req, res) => {  
  const updateProductId = req.params._id;
  const idObject = new ObjectId(updateProductId)
  const result = await productCollection.findOne( idObject );
  res.send(result); 
  console.log(idObject);
})
    

app.put('/updateProduct/:_id', async (req, res) => {
  const updateId = req.params._id;
  const updateCar = req.body;
  console.log(updateCar);
  const filter = {_id: new ObjectId(updateId)}
  const options = { upsert: true };
  const updateCarElement = {
    $set: {
      productName: updateCar.productName,
      brandName: updateCar.brandName,
      type: updateCar.type,
      price: updateCar.price,
      description: updateCar.description,
      rating: updateCar.rating,
      image: updateCar.image,
      userEmail: updateCar.userEmail
    }
  }
    

const result = await productCollection.updateOne(filter, updateCarElement, options)
  res.send(result); 
  console.log(result);
})



// Send a ping to confirm a successful connection
// await client.db("admin").command({ ping: 1 });
console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {
// Ensures that the client will close when you finish/error
// await client.close();
}
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

