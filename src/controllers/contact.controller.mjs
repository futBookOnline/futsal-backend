import ContactEmail from "../models/contact.model.mjs";
import { adjustDateToNepalTimezone } from "../utils/helper.utils.mjs";
import mongoose from "mongoose";

// GET API: List All Contact Emails
const listEmails = async (req, res) => {
  const { queryStartDate, queryEndDate } = req.query;
  let query = {};
  try {
    if (queryStartDate) {
      const startDate = new Date(queryStartDate);
      query = {
        date: { $gte: startDate, $lte: startDate },
      };
      if (queryEndDate) {
        const endDate = new Date(queryEndDate);
        query = {
          date: { $gte: startDate, $lte: endDate },
        };
      }
    }
    const response = await ContactEmail.find(query).populate("futsalOwnerId");
    response.length > 0
      ? res.status(200).json(response)
      : res.status(404).json({ message: "List is empty" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// GET API: List All Unread Contact Emails
const listUnreadEmails = async (req, res) => {
  try {
    const response = await ContactEmail.find({ isOpened: false });
    response.length > 0
      ? res.status(200).json(response)
      : res.status(404).json({ message: "List is empty" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// POST API: Receive Email Through Contact Page
const saveEmailFromContactPage = async (req, res) => {
  const emailObject = req.body;
  emailObject.date = new Date();
  try {
    const response = await ContactEmail.create(emailObject);
    response
      ? res.status(201).json(response)
      : res.status(400).json({ message: "Could Add Contact Email" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT API: Mark Email As Read
const markEmailAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await ContactEmail.findByIdAndUpdate(
      id,
      { isOpened: true },
      { new: true }
    );
    return response
      ? res.status(201).json(response)
      : res.status(404).json({ message: "Email does not exist." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE API: Delete Email By Id
const deleteEmail = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await ContactEmail.findByIdAndDelete(id);
    !response
      ? res.status(404).json({ message: "Email does not exist." })
      : res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE API: Delete All Emails
const deleteAllEmails = async (req, res) => {
  try {
    const result = await ContactEmail.deleteMany({}); // Empty filter to delete all documents
    const deletedCount = result.deletedCount;
    res.status(200).json({
      message: `${deletedCount} email${
        deletedCount > 1 ? "s" : ""
      } deleted successfully`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  listEmails,
  listUnreadEmails,
  saveEmailFromContactPage,
  markEmailAsRead,
  deleteEmail,
  deleteAllEmails,
};
