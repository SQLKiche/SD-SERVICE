const express = require('express');
const app = express();
const path = require('path');

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'faq-chatbot-v1.html'));
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📂 Ouvre ton navigateur et va sur : http://localhost:${PORT}`);
});


