import Contact from "../models/Contact.js";
import Devotee from "../models/Devotee.js";
import { logAudit } from "../utils/auditLog.js";

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const record = await Contact.create({ name, email, subject, message });
    await logAudit({ action: "CREATE_CONTACT", entityType: "contact", entityId: String(record.id), newValue: { name, subject } });
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

/* POST /api/contacts/:id/convert-to-devotee — PRD §8 Convert Contact → Devotee */
export const convertToDevotee = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found." });

    const { devotee, created } = await Devotee.findOrCreateFrom({
      name:  contact.name,
      email: contact.email,
      phone: req.body.phone || null,
    });

    if (created) {
      await Devotee.addTimeline(devotee.id, {
        event_type: "contact_converted",
        title: "Converted from contact message",
        description: `Subject: ${contact.subject}`,
        related_entity_type: "contact", related_entity_id: String(contact.id), icon: "📬",
      });
    }

    await logAudit({
      action: created ? "CONTACT_TO_DEVOTEE_CREATED" : "CONTACT_TO_DEVOTEE_LINKED",
      entityType: "devotee",
      entityId: devotee.devotee_ref || String(devotee.id),
      newValue: { contactId: contact.id, name: contact.name },
    });

    res.json({
      success: true,
      message: created
        ? `Devotee contact created: ${devotee.devotee_ref}`
        : `Linked to existing devotee: ${devotee.devotee_ref}`,
      data: { devotee, created },
    });
  } catch (err) { next(err); }
};
