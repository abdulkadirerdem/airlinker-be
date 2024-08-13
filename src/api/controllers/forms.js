const { FormModel } = require("../models/form");

const createForm = async (req, res) => {
  try {
    const form = new FormModel(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getForms = async (req, res) => {
  try {
    const forms = await FormModel.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const submitResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const response = req.body;
    const form = await FormModel.findById(id);
    if (!form) return res.status(404).json({ error: "Form not found" });

    form.responses.push(response);
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createForm, getForms, submitResponse };
