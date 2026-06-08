import Contact from "../models/Contact.js";

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const record = await Contact.create({ name, email, subject, message });
    res.status(201).json({
      success: true,
      message: "Your message has been received. We will get back to you shortly.",
      data: { id: record.id, created_at: record.created_at },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = parseInt(req.query.offset) || 0;
    const rows = await Contact.findAll({ limit, offset });
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const record = await Contact.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Not found." });
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};
