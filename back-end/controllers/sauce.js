const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.likesDislikesSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce.usersLiked.includes(req.auth.userId) && req.body.like === 1) {
      Sauce.updateOne(
        { _id: req.params.id },
        { $inc: { likes: 1 }, $push: { usersLiked: req.auth.userId } }
      )
        .then(() => res.status(200).json({ message: "sauce liked !" }))
        .catch((error) => res.status(400).json({ error }));
    } else if (
      !sauce.usersDisliked.includes(req.auth.userId) &&
      req.body.like === -1
    ) {
      Sauce.updateOne(
        { _id: req.params.id },
        { $inc: { dislikes: 1 }, $push: { usersDisliked: req.auth.userId } }
      )
        .then(() => res.status(200).json({ message: "sauce disliked !" }))
        .catch((error) => res.status(400).json({ error }));
    } else if (
      sauce.usersLiked.includes(req.auth.userId) &&
      req.body.like === 0
    ) {
      Sauce.updateOne(
        { _id: req.params.id },
        { $inc: { likes: -1 }, $pull: { usersLiked: req.auth.userId } }
      )
        .then(() =>
          res.status(200).json({ message: "Like removed from sauce !" })
        )
        .catch((error) => res.status(400).json({ error }));
    } else if (
      sauce.usersDisliked.includes(req.auth.userId) &&
      req.body.like === 0
    ) {
      Sauce.updateOne(
        { _id: req.params.id },
        { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.auth.userId } }
      )
        .then(() =>
          res.status(200).json({ message: "Dislike removed from sauce !" })
        )
        .catch((error) => res.status(400).json({ error }));
    } else {
      res.status(400).json({ error: "Invalid request." });
    }
  });
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
      };

  delete sauceObject._userId;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        if (req.file && sauce.imageUrl) {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            console.log(`Ancienne image effacée: ${filename}`);
          });
        }
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
