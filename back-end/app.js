const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb+srv://LS:openclassrooms@cluster0-pme76.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/api/sauces", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "Objet créé !",
  });
});

app.get("/api/sauces", (req, res, next) => {
  const sauces = [
    {
      _id: "oeihfzeoi",
      name: "Mon premier objet",
      manufacturer: "Kezaco",
      description: "Les infos de mon premier objet",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
      heat: 2,
      likes: 2,
      dislikes: 2,
      usersLiked: ["qsomigbqui"],
      usersDisliked: ["qjdofljgbj"],
      userId: "qsomihvqios",
    },
    {
      _id: "oeihfzeoi",
      name: "Mon premier objet",
      manufacturer: "Mainheat",
      description: "Les infos de mon premier objet",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
      heat: 2,
      likes: 2,
      dislikes: 2,
      usersLiked: ["qsomigbqui"],
      usersDisliked: ["qjdofljgbj"],
      userId: "qsomihvqios",
    },
  ];
  res.status(200).json(sauces);
});

module.exports = app;
