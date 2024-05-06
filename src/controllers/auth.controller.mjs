import User from "../models/user.model.mjs";
import {
  oauth2Client,
  getUserInfo,
  createToken,
} from "../utils/auth.utils.mjs";

const getGoogleLogin = async (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(authUrl);
};
const googleOAuthCallback = async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    const userInfo = await getUserInfo(tokens.access_token, tokens.id_token);
    const result = await isUserInSystem(userInfo);
    if (result) {
      const token = createToken(result._id);
      const maxAge = 3 * 24 * 60 * 60;
      res
        .cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
        .status(200).redirect("http://localhost:5173/dashboard");
    } else {
      const user = await addGoogleUser(userInfo);
      user
        ? res.status(201).json({ data: userInfo, error: null })
        : res
            .status(400)
            .json({ data: null, error: "Could not register user" });
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    res.status(500).send("Error retrieving token");
  }
};

// Check If Google User Already Registered
const isUserInSystem = async (googleUser) => {
  const { email } = googleUser;
  const user = await User.findOne({ email });
  return user || null;
};

// Add new user
const addGoogleUser = async (googleUser) => {
  const { name, email, picture } = googleUser;
  try {
    const user = await User.create({
      fullname: name,
      email,
      profileImage: picture,
    });
    return user || null;
  } catch (error) {
    return error.message;
  }
};
export { getGoogleLogin, googleOAuthCallback };
