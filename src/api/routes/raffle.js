const {
  createRaffle,
  getRaffles,
  getRaffleById,
  updateRaffle,
  deleteRaffle,
  addParticipant,
  drawWinner,
} = require("../controllers/raffle");

module.exports = (router) => {
  router.post("/raffles", createRaffle);
  router.get("/raffles", getRaffles);
  router.get("/raffles/:id", getRaffleById);
  router.put("/raffles/:id", updateRaffle);
  router.delete("/raffles/:id", deleteRaffle);
  router.post("/raffles/:raffleId/participants", addParticipant);
  router.post("/raffles/:raffleId/draw", drawWinner);
};
