import FutsalCustomer from "../models/venue.customer.model.mjs";
const addLoggedUserAsFutsalCustomer = async (venueId, userId) => {
  const customerExists = await loggedUserAlreadyExistsAsCustomer(
    venueId,
    userId
  );
  try {
    if (!customerExists) {
      const response = await FutsalCustomer.create({ venueId, userId });
      if (!response) {
        console.log("Could not add customer");
      }
      console.log("RESPONSE:", response);
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
};

const addGuestUserAsFutsalCustomer = async (venueId, guestUser) => {
  const { fullName, email, contact } = guestUser;
  const customerExists = await guestUserAlreadyExistsAsCustomer(
    venueId,
    fullName,
    email,
    contact
  );
  try {
    if (!customerExists) {
      const response = await FutsalCustomer.create({
        venueId,
        guestUser,
      });
      if (!response) {
        console.log("Could not add guest customer");
      }
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
};

const loggedUserAlreadyExistsAsCustomer = async (venueId, userId) => {
  const response = await FutsalCustomer.countDocuments({ venueId, userId });
  return response > 0;
};

const guestUserAlreadyExistsAsCustomer = async (
  venueId,
  fullName,
  email,
  contact
) => {
  const response = await FutsalCustomer.countDocuments({
    venueId: venueId,
    "guestUser.fullName": fullName,
    "guestUser.email": email,
    "guestUser.contact": contact,
  });
  return response > 0;
};

export { addLoggedUserAsFutsalCustomer, addGuestUserAsFutsalCustomer };
