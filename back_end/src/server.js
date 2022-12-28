// First import should be dotenv so that you can use environment variables through-out, specifically disabling host check

import dotenv from 'dotenv';
import express from 'express';
import {db,connectToDb} from './mongo-db-data/db.js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config.js';
import admin from 'firebase-admin';

// __dirname needs to be clarified to file URL Path

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse (
    fs.readFileSync('./credentials.json')
);

admin.initializeApp({
    credential: admin.credential.cert(credentials),

});

const app = express();
app.use(express.json());
// Tell Express the use the Build Folder as the root of the Static Content
app.use(express.static(path.join(__dirname, '../build')));

// Create a regex to handle any request to the server that isn't one of the API Calls

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

// Middleware to get Auth Tokens from Request Header

app.use(async (req, res, next) =>  {
    const {authtoken} = req.headers;
    if (authtoken) {
        try {
            req.user = await admin.auth().verifyIdToken(authtoken);
    } catch (e){
        return res.sendStatus(400);
    }
}
    req.user = req.user || {};
next();

});

// Created an in-memory JSON Collection

{/*let arcticlesInfo = [{
    name:'learn-react',
    upvotes: 0,
    comments:[],
},{
    name:'learn-node',
    upvotes:0,
    comments:[],
},{
    name:'mongodb',
    upvotes:0,
    comments:[],
}];
*/}
// MultiLine Comments require format {/*comment*/}

{/*app.post('/hello', (req, res) => {
     console.log(req.body);
    res.send(`Hello ${req.body.name}`);

});

app.get('/hello/:name',(req, res) => {
    const {name} = req.params;
    res.send (`Hello ${name}`);

});
*/}

app.get('/api/articles/:name', async(req, res) => {
    const {name} = req.params;
    const {uid} = req.user;

    const article = await db.collection('articles').findOne({name});
    
    if (article){
        const upvoteIds = article.upvoteIds || [];
        article.canUpvote = uid && !upvoteIds.includes(uid);
        res.json(article);
    } else {
        res.sendStatus(404);
    }
}

)

app.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
});

app.put('/api/articles/:name/upvote', async (req,res)=> {
    const {name} = req.params;
    const {uid} = req.user;
    
    const article = await db.collection('articles').findOne({name});

    if (article){
        console.log(name);
        const upvoteIds = article.upvoteIds || [];
        const canUpvote = uid && !upvoteIds.includes(uid);

        if (canUpvote){
            await db.collection('articles').updateOne({name},{
            $inc:{upvotes:1},
            $push: { upvoteIds: uid},
            });
        }
        const updatedArticle = await db.collection('articles').findOne({name});
        res.json(updatedArticle);
        console.log(`Updated voting to ${article.upvotes}`);
    }    
    else {
        res.send('That article does not exist');
    }
});

app.post('/api/articles/:name/comments', async (req,res)=> {
    const {name} = req.params;
    const {text} = req.body;
    const {email} = req.user;
      
    await db.collection('articles').updateOne({name},{
        $push:{comments:{postedBy: email, text}},
           
    });
    const article = await db.collection('articles').findOne({name});

 //   const article = arcticlesInfo.find(a=>a.name===name);
    if (article) {
 //       article.comments.push({postedBy, text});
        res.json(article);
    } else {
    res.send('That Article does not exist');
}
});

// Update the Server to take a Dynamic Port for Listening that is specified by the Hosting Provider

const PORT = process.env.PORT || 8000;

connectToDb(() => {
    const now = new Date();
        console.log("Server Started at " + now.getHours() + ":" + now.getMinutes());
        console.log("Database Connection is running on port 27017");
    app.listen(PORT, () => {
        console.log('Server is Listening on port '+ PORT);
    });
})