
const Contact = require("../models/Contact");

/* =========================================================
   CREATE CONTACT MESSAGE
========================================================= */

const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    /* ---------------------------------------------
       VALIDATION
    --------------------------------------------- */

    if (
      !name?.trim() ||
      !email?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, subject and message are required.",
      });
    }

    /* ---------------------------------------------
       SAVE MESSAGE
    --------------------------------------------- */

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      subject: subject.trim(),
      message: message.trim(),
      status: "New",
    });

    res.status(201).json({
      success: true,
      message:
        "Your message has been sent successfully.",
      contact,
    });
  } catch (error) {
    console.error(
      "CREATE CONTACT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to send your message.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ALL CONTACT MESSAGES - ADMIN
========================================================= */

const getAdminContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error(
      "GET ADMIN CONTACTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load contact messages.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE CONTACT - ADMIN
========================================================= */

const getAdminContactById = async (req, res) => {
  try {
    const contact =
      await Contact.findById(
        req.params.id
      ).lean();

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error(
      "GET CONTACT DETAILS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load message.",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE CONTACT STATUS
========================================================= */

const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "New",
      "Read",
      "Replied",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid contact status.",
      });
    }

    const contact =
      await Contact.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Message status updated successfully.",
      contact,
    });
  } catch (error) {
    console.error(
      "UPDATE CONTACT STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update message status.",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE CONTACT
========================================================= */

const deleteContact = async (req, res) => {
  try {
    const contact =
      await Contact.findByIdAndDelete(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Message deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE CONTACT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete message.",
      error: error.message,
    });
  }
};

module.exports = {
  createContact,
  getAdminContacts,
  getAdminContactById,
  updateContactStatus,
  deleteContact,
};

