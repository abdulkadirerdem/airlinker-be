const { FormModel } = require("../models/form");
const { AirlinkModel } = require("../models/airlink");

const createForm = async (req, res) => {
  try {
    const { airlink: airlinkId } = req.body;

    const airlink = await AirlinkModel.findById(airlinkId);

    if (!airlink) {
      return res.status(404).json({ message: "Airlink not found" });
    }

    if (airlink.form) {
      return res
        .status(400)
        .json({ message: "This Airlink already has a form." });
    }

    const form = new FormModel({
      ...req.body,
      airlink: airlinkId,
    });

    await form.save();

    airlink.form = form._id;
    await airlink.save();

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

    const responseArr = [];

    for (const [key, value] of Object.entries(response)) {
      responseArr.push({ questionId: key, answer: value });
    }

    const reponseModel = { answers: responseArr };

    form.responses.push(reponseModel);
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createForm, getForms, submitResponse };
