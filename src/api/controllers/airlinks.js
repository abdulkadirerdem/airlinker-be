const { AirlinkModel } = require("../models/airlink");

const createAirlink = async (req, res) => {
  try {
    const airlink = new AirlinkModel(req.body);
    await airlink.save();
    res.status(201).json(airlink);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAirlinks = async (req, res) => {
  try {
    const airlinks = await AirlinkModel.find().populate("form");
    res.status(200).json(airlinks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createAirlink, getAirlinks };
