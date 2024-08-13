const {
  createForm,
  getForms,
  submitResponse,
} = require("../controllers/forms");

module.exports = (router) => {
  router.post("/forms", createForm);
  router.get("/forms", getForms);
  router.post("/forms/:id/responses", submitResponse);
};
