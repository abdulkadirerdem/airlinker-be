const {
  createAirlink,
  getAirlinks,
  getAirlinksByWorkstation,
} = require("../controllers/airlinks");

module.exports = (router) => {
  router.post("/airlinks", createAirlink);
  router.get("/airlinks", getAirlinks);
  router.get("/workspace/airlinks/:id", getAirlinksByWorkstation);
};
