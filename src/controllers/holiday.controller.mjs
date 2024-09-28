import Holiday from "../models/holiday.model.mjs";
import { adjustDateToNepalTimezone } from "../utils/helper.utils.mjs";

// GET API: Fetch All Holidays
const listHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    holidays.length < 1
      ? res.status(404).json({ message: "There are no holidays." })
      : res.status(200).json(holidays);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET API: Fetch One Holiday By Id
const getHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    holiday
      ? res.status(200).json(holiday)
      : res.status(404).json({ message: "Holiday Not Found" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST API: Add New Holiday
const addHoliday = async (req, res) => {
  const { date, name, description } = req.body;
  // let holidayDate = adjustDateToNepalTimezone(date);
  try {
    const holiday = await Holiday.create({
      date,
      name,
      description,
    });
    holiday
      ? res.status(201).json(holiday)
      : res.status(401).json({ message: "Could not add holiday." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE API: Delete Holiday
const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const holiday = await Holiday.findByIdAndDelete(id);
    holiday
      ? res.status(200).json({ message: "Holiday deleted successfully" })
      : res.status(200).json({ message: "Holiday not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting holiday" });
  }
};

// PUT API: Update Holiday
const updateHoliday = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;
  try {
    const holiday = await Holiday.findById(id);
    if (!holiday)
      return res.status(401).json({ message: "Holiday does not exist." });
    const updatedHoliday = await Holiday.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedHoliday)
      return res.status(401).json({ message: "Holiday update failed." });
    res.status(200).json(updatedHoliday);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE API: Delete All Holiday
const deleteAllHolidays = async (req, res) => {
  try {
    const holiday = await Holiday.deleteMany({});
    console.log("HOLIDAY: ", holiday)
    holiday
      ? res
          .status(200)
          .json({
            message: `${holiday.deletedCount} holiday deleted successfully`,
          })
      : res.status(200).json({ message: "Holiday not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting holiday" });
  }
};

export {
  listHolidays,
  getHoliday,
  addHoliday,
  updateHoliday,
  deleteHoliday,
  deleteAllHolidays,
};
