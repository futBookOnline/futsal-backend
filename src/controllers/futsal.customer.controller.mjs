import FutsalCustomer from "../models/venue.customer.model.mjs"

const getAllCustomers = async(req, res) => {
    try {
        const response = await FutsalCustomer.find().populate(['venueId', 'userId'])
        response ? res.status(200).json(response) : res.status(404).json({message: "Customers list is empty."})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const getCustomersByVenue = async(req, res) => {
    const {venueId} = req.params
    try {
        const response = await FutsalCustomer.find({venueId}).populate(['venueId', 'userId'])
        response ? res.status(200).json(response) : res.status(404).json({message: "Customers not found"})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}
const deletetAllCustomer = async (req, res) => {
try {
    const response = await FutsalCustomer.deleteMany({})
    res.status(200).json({
        message: `${response.deletedCount} customers deleted successfully`,
      });
} catch (error) {
    res.status(400).json({message: error.message})
}
}

export{getAllCustomers, getCustomersByVenue, deletetAllCustomer}