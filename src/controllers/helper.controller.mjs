import FutsalCustomer from "../models/venue.customer.model.mjs";

const deletetAllCustomer = async (req, res) => {
  try {
    const result = await FutsalCustomer.deleteMany({}); // Empty filter to delete all documents
    res.status(200).json({
      message: `${result.deletedCount} customers deleted successfully`,
    });
  } catch (error) {
   res.status(400).json({ message: error.message });
  }
};

const getAllCustomers = async(req, res) => {
    try {
        const response = await FutsalCustomer.find().populate(['venueId', 'userId']);
        response ? res.status(200).json(response) : res.status(404).json({message: "No customers found"})
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export {deletetAllCustomer, getAllCustomers}