const Dev = require("../models/Dev");
const axios = require("axios");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      /* console.log(name, avatar_url, bio, github_username, techsArray, location); */
    } else {
      res.status(400).json({ erro: "Já existe usuario cadastrado" });
    }

    return res.json(dev);
  },

  async update(req, res) {
    const dev = await Dev.findByIdAndUpdate(req.params.id, req, body, {
      new: true
    });

    return res.json(dev);
  },

  async destroy(req, res) {
    await Dev.findByIdAndDelete(req.params.id);

    return res.json({ deletado: "Deletado" });
  }
};
