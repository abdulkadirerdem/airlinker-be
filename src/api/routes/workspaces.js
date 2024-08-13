const { createWorkspace, getWorkspaces } = require("../controllers/workspaces");

module.exports = (router) => {
  router.post("/workspaces", createWorkspace);
  router.get("/workspaces", getWorkspaces);
};
