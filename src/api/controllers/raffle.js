// src/api/controllers/raffle.js
const raffleService = require("../services/raffle-services");
const { AirlinkModel } = require("../models/airlink");

// Yeni raffle oluştur
const createRaffle = async (req, res) => {
  try {
    const { airlink: airlinkId } = req.body;

    const airlink = await AirlinkModel.findById(airlinkId);

    if (!airlink) {
      return res.status(404).json({ message: "Airlink not found" });
    }

    if (airlink.form || airlink.quiz || airlink.raffle) {
      return res.status(400).json({
        message: "This Airlink already has a form, quiz, or raffle.",
      });
    }

    const raffle = await raffleService.createRaffle(req.body);

    airlink.raffle = raffle._id;
    await airlink.save();
    res.status(201).json(raffle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Raffle'ları getir
const getRaffles = async (req, res) => {
  try {
    const raffles = await raffleService.getRaffles();
    res.status(200).json(raffles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Belirli bir raffle getir
const getRaffleById = async (req, res) => {
  try {
    const raffle = await raffleService.getRaffleById(req.params.id);
    if (!raffle) return res.status(404).json({ error: "Raffle not found" });
    res.status(200).json(raffle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Raffle güncelle
const updateRaffle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRaffle = await raffleService.updateRaffle(id, req.body);
    if (!updatedRaffle)
      return res.status(404).json({ error: "Raffle not found" });
    res.status(200).json(updatedRaffle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Raffle sil
const deleteRaffle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRaffle = await raffleService.deleteRaffle(id);
    if (!deletedRaffle)
      return res.status(404).json({ error: "Raffle not found" });
    res.status(200).json({ message: "Raffle deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Katılımcı ekle
const addParticipant = async (req, res) => {
  try {
    const { raffleId } = req.params;
    const participantResponse = req.body;

    const responseArr = [];

    for (const [key, value] of Object.entries(participantResponse)) {
      responseArr.push({ questionId: key, answer: value });
    }

    const reponseModel = { answers: responseArr };

    const updatedRaffle = await raffleService.addParticipant(
      raffleId,
      reponseModel
    );
    res.status(200).json(updatedRaffle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Kazananı belirle
const drawWinner = async (req, res) => {
  try {
    const { raffleId } = req.params;

    const updatedRaffle = await raffleService.drawWinner(raffleId);
    res.status(200).json(updatedRaffle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRaffle,
  getRaffles,
  getRaffleById,
  updateRaffle,
  deleteRaffle,
  addParticipant,
  drawWinner,
};
