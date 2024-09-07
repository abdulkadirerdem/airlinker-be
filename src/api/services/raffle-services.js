const { RaffleModel } = require("../models/raffle");

// Yeni raffle oluştur
const createRaffle = async (raffleData) => {
  const { title, description, participationInformation, airlink } = raffleData;
  const raffle = new RaffleModel({
    title,
    description,
    participationInformation,
    airlink,
  });
  await raffle.save();
  return raffle;
};

// Raffle'ları getir
const getRaffles = async () => {
  return await RaffleModel.find();
};

// Belirli bir raffle getir
const getRaffleById = async (id) => {
  return await RaffleModel.findById(id);
};

// Raffle güncelle
const updateRaffle = async (id, raffleData) => {
  return await RaffleModel.findByIdAndUpdate(id, raffleData, { new: true });
};

// Raffle sil
const deleteRaffle = async (id) => {
  return await RaffleModel.findByIdAndDelete(id);
};

// Katılımcı ekle
const addParticipant = async (raffleId, participantResponse) => {
  const raffle = await RaffleModel.findById(raffleId);
  if (!raffle) throw new Error("Raffle not found");

  raffle.participants.push(participantResponse);
  await raffle.save();
  return raffle;
};

// Kazananı belirle
const drawWinner = async (raffleId) => {
  const raffle = await RaffleModel.findById(raffleId);
  if (!raffle) throw new Error("Raffle not found");

  if (raffle.participants.length === 0)
    throw new Error("No participants in the raffle");

  // Kazananı rastgele seç
  const randomIndex = Math.floor(Math.random() * raffle.participants.length);
  const winner = raffle.participants[randomIndex];

  raffle.winner = winner;
  await raffle.save();
  return raffle;
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
