const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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

app.use(express.json());

// Base de données simulée (en production, utilisez une vraie BD)
const usersDB = [];

// Route d'inscription
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = usersDB.find((u) => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = {
      id: usersDB.length + 1,
      email,
      name,
      password: hashedPassword,
    };
    usersDB.push(newUser);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Route de connexion
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = usersDB.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer le payload du JWT
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
    // Signer le token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      message: 'Connexion réussie',
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

const authMiddleware = require('./middleware/auth');
// Route protégée - accessible uniquement avec token valide
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({
    message: 'Accès autorisé à votre profil',
    user: req.user,
  });
});

// Route admin protégée
app.get('/api/admin/users', authMiddleware, (req, res) => {
  // Vérifier si l'utilisateur est admin (exemple)
  if (req.user.email !== 'admin@exemple.com') {
    return res.status(403).json({ message: 'Accès interdit. Droits administrateur requis.' });
  }

  res.json({
    message: 'Liste des utilisateurs (admin uniquement)',
    users: usersDB.map((u) => ({ id: u.id, email: u.email, name: u.name })),
  });
});

// Route pour rafraîchir le token
app.post('/api/refresh-token', authMiddleware, (req, res) => {
  const newToken = jwt.sign(
    { userId: req.user.userId, email: req.user.email, name: req.user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  res.json({ token: newToken });
});
app.listen(process.env.PORT_SERVER, () => {
  console.log(`Serveur démarré sur http://localhost:${process.env.PORT_SERVER}`);
});
