const { createAirlink, getAirlinks } = require("../controllers/airlinks");

module.exports = (router) => {
  router.post("/airlinks", createAirlink);
  router.get("/airlinks", getAirlinks);
};
