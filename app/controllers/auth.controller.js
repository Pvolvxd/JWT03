import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import authConfig from "../config/auth.config.js";

const {
  user: User,
  role: Role,
  refreshToken: RefreshToken,
} = db;


// ==============================
// REGISTRO
// ==============================

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);

    const userRole = await Role.findOne({
      where: { name: "user" },
    });

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await user.setRoles([userRole]);

    res.status(201).json({
      message: "User registered successfully!",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==============================
// LOGIN
// ==============================

export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
      include: {
        model: Role,
        as: "roles",
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User Not found.",
      });
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    // Access Token temporal: 20 segundos
    const accessToken = jwt.sign(
      { id: user.id },
      authConfig.secret,
      {
        expiresIn: 20,
      }
    );

    // Refresh Token: 7 días
    const refreshTokenValue = crypto
      .randomBytes(40)
      .toString("hex");

    const expiryDate = new Date();

    expiryDate.setDate(
      expiryDate.getDate() + 7
    );

    await RefreshToken.create({
      token: refreshTokenValue,
      expiryDate,
      userId: user.id,
    });

    const authorities = user.roles.map(
      (role) =>
        `ROLE_${role.name.toUpperCase()}`
    );

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken,
      refreshToken: refreshTokenValue,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==============================
// REFRESH TOKEN
// ==============================

export const refreshToken = async (req, res) => {
  try {
    const {
      refreshToken: requestToken,
    } = req.body;

    if (!requestToken) {
      return res.status(403).json({
        message: "Refresh Token is required!",
      });
    }

    const storedToken =
      await RefreshToken.findOne({
        where: {
          token: requestToken,
        },
      });

    if (!storedToken) {
      return res.status(403).json({
        message:
          "Refresh token is not in database!",
      });
    }

    if (
      storedToken.expiryDate.getTime() <
      Date.now()
    ) {
      await storedToken.destroy();

      return res.status(403).json({
        message: "Refresh token expired.",
      });
    }

    // Nuevo Access Token temporal: 20 segundos
    const newAccessToken = jwt.sign(
      { id: storedToken.userId },
      authConfig.secret,
      {
        expiresIn: 20,
      }
    );

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: requestToken,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==============================
// CERRAR SESIÓN
// ==============================

export const signout = async (req, res) => {
  try {
    const {
      refreshToken: requestToken,
    } = req.body;

    if (!requestToken) {
      return res.status(400).json({
        message: "Refresh Token is required!",
      });
    }

    const deleted =
      await RefreshToken.destroy({
        where: {
          token: requestToken,
        },
      });

    if (deleted === 0) {
      return res.status(404).json({
        message: "Refresh token not found.",
      });
    }

    res.status(200).json({
      message: "Signout successful!",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};