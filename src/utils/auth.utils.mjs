import axios from "axios";
import jwt from "jsonwebtoken"
import { google } from "googleapis";
import 'dotenv/config'
import bcrypt from "bcrypt";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI
const JWT_SECRET = process.env.JWT_SECRET

// Create OAuth2 client
export const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

// Function to fetch user info using Google API
export const getUserInfo = async (accessToken, idToken) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${accessToken}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user`);
    throw new Error(error.message);
  }
};

// Create JWT Token
const maxAge = 3 * 24 * 60 * 60;
export const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: maxAge });
};


// password hashing function
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt()
  const result = await bcrypt.hash(password, salt)
  return result
}

export const comparePassword = async(password, dbPassword) => {
  const result = await bcrypt.compare(password, dbPassword)
  return result
}