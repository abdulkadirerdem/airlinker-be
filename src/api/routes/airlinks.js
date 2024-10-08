const {
  createAirlink,
  getAirlinks,
  getAirlinksByWorkstation,
  deleteAirlink,
} = require("../controllers/airlinks");

module.exports = (router) => {
  router.post("/airlinks", createAirlink);
  router.get("/airlinks", getAirlinks);
  router.get("/workspace/airlinks/:id", getAirlinksByWorkstation);
  router.delete("/airlinks/:id", deleteAirlink);
};
