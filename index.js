require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 8000;
const dbUri = process.env.DB_URI


// middlewares
app.use(express.json())
app.use(cors())

const client = new MongoClient(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const checkLike = (post, likeCollection) => {

    return count
}

async function run() {
    try {
        let userCollection = await client.db('toonTab').collection('users')
        let postCollection = await client.db('toonTab').collection('posts')
        let reactionCollection = await client.db('toonTab').collection('reactions')

        app.get('/', (req, res) => {
            res.send({ message: "This is the root API of TOON TAB application server." });
        })


        app.get('/all-users-usernames', async (req, res) => {
            let users = await userCollection.find({}).toArray()
            let userNames = users.map(user => user?.userName?.toLowerCase());
            res.send({ userNames })
        })

        app.get('/all-users', async (req, res) => {
            let users = await userCollection.find({}).toArray()
            res.send({ users })
        })
        app.get('/all-posts', async (req, res) => {
            let posts = await postCollection.find({}).toArray()
            res.send({ posts })
        })


        app.get('/user-info', async (req, res) => {
            let email = req.query.email
            let user = await userCollection.findOne({ email: email })
            res.send(user)
        })

        app.put('/update-ratings', async (req, res) => {
            let rating = req.body.rate
            let email = req.query.email
            let updateDoc = {
                $set: {
                    rating: parseInt(rating)
                }
            }
            let result = await userCollection.updateOne({ email: email }, updateDoc, { upsert: true })
            res.send(result)
        })
        app.put('/react-update', async (req, res) => {
            let react = req.body.reaction
            let email = req.query.email
            let postID = req.query.postID
            let updateDoc = {
                $set: {
                    react: react
                }
            }
            let result = await reactionCollection.updateOne({ email: email, postID: postID }, updateDoc, { upsert: true })
            res.send(result)
        })
        app.delete('/react-delete', async (req, res) => {
            let email = req.query.email
            let postID = req.query.postID
            let result = await reactionCollection.deleteOne({ email: email, postID: postID })
            res.send(result)
        })


        app.get('/react-check', async (req, res) => {
            let postID = req.query.postID
            let email = req.query.email
            let result = await reactionCollection.findOne({ email: email, postID: postID })
            let liked = await reactionCollection.find({ postID: postID, react: 'liked' }).toArray()
            let disliked = await reactionCollection.find({ postID: postID, react: 'disliked' }).toArray()
            res.send({ liked: liked.length, disliked: disliked.length, react: result?.react || 'none' })
        })
        app.get('/my-user', async (req, res) => {
            let email = req.query.email
            let user = await userCollection.findOne({ email: email })
            res.send(user)
        })

        app.post('/insert-user', async (req, res) => {
            let newUser = req.body
            let user = await userCollection.findOne({ email: newUser.email })
            if (!user?.email)
                result = await userCollection.insertOne(newUser)
            user = await userCollection.findOne({ email: newUser.email })

            res.send(user)
        })

    }
    finally {

    }
}

run().catch(err => console.error(err));

app.listen(port, () => {
    client.connect(err => {
        if (err) console.log(err);
        else console.log('DB connection established')
    });
    console.log(`Server listening on port ${port}`);
});