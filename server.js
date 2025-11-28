const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'change-this-secret-to-a-secure-value',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Servir archivos estáticos (Index.html, css/, js/, img/)
app.use(express.static(path.join(__dirname)));

// Ruta para obtener comentarios de la sesión
app.get('/comments', (req, res) => {
  res.json({ comments: req.session.comments || [] });
});

// Ruta para añadir un comentario a la sesión
app.post('/comment', (req, res) => {
  const text = (req.body.comment || '').toString().trim();
  if (!req.session.comments) req.session.comments = [];
  if (text.length) {
    req.session.comments.push({ text, time: Date.now() });
  }
  res.json({ comments: req.session.comments });
});

// Fallback: servir el index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
