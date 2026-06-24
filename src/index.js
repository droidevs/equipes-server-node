const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');

// mongodb
const DB_USER = 'root';
const DB_PASSWORD = 'example';
const DB_HOST = 'mongo';
const DB_PORT = '27017';

const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
const connectWithRetry = () => {
  console.log('Attempting to connect to MongoDB...');
  mongoose
    .connect(URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
      console.error('Error connecting to MongoDB, retrying in 5 seconds...', err.message);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();


// init app
const PORT = 4000;
const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// redis
const REDIS_PORT = 6379;
const REDIS_HOST = 'redis';
const redisClient = redis.createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.connect();

const equipes = require('../equipe.json');
app.use(express.json());

app.get('/equipes', (req, res) => {
  res.status(200).json(equipes);
});

app.get('/', (req, res) => {
  redisClient.set('Products', 'Products .....');
  res.send('Hello ');
});

app.get('/equipes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const equipe = equipes.find((m) => m.id === id);
  res.status(200).json(equipe);
});

app.get('/data', async (req, res) => {
  const products = await redisClient.get('Products');
  res.send(`<h1> Bienvenue<h1> <h2>${products}</h2>`);
});

app.post('/equipes', (req, res) => {
  equipes.push(req.body);
  res.status(200).json(equipes);
});

app.put('/equipes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let equipe = equipes.find((m) => m.id === id);
  equipe.country = req.body.country;
  res.status(200).json(equipe);
});

app.delete('/equipes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let equipe = equipes.find((m) => m.id === id);
  equipes.splice(equipes.indexOf(equipe), 1);
  res.status(200).json(equipes);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
