import User from "../models/user.model.mjs";
import {
  oauth2Client,
  getUserInfo,
  createToken,
} from "../utils/auth.utils.mjs";

const SUCCESS_REDIRECT_URL = "http://localhost:5173/";
const FAILURE_REDIRECT_URL = "http://localhost:5173/login";

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
    const maxAge = 3 * 24 * 60 * 60;
    if (result) {
      const token = createToken(result._id);
      return res
        .cookie("jwt-login-user", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        })
        .status(200)
        .redirect(SUCCESS_REDIRECT_URL);
    }
    const user = await addGoogleUser(userInfo);
    if (!user)
      return res
        .status(400)
        .json({ message: "Could not register user" })
        .redirect(FAILURE_REDIRECT_URL);
    const token = createToken(user._id);
    res
      .status(201)
      .cookie("jwt-login-user", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      })
      .redirect(SUCCESS_REDIRECT_URL);
  } catch (error) {
    res
      .status(500)
      .send("Error retrieving token")
      .redirect(FAILURE_REDIRECT_URL);
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
      fullName: name,
      email,
      isActive: true,
      imageUrl: picture,
      isGoogleUser: true,
    });
    return user || null;
  } catch (error) {
    return error.message;
  }
};
export { getGoogleLogin, googleOAuthCallback };
