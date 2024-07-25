import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const router = express.Router();

// Function to generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

//ROUTE FOR REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, msg: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//ROUTE FOR LOGIN
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ msg: 'Invalid credentials' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (isMatch) {
//             const payload = {
//                 id: user._id,
//                 email: user.email
//             };

//             jwt.sign(
//                 payload,
//                 process.env.JWT_SECRET,
//                 { expiresIn: 3600 },
//                 (error, token) => {
//                     if (error) throw error;

//                     res.json({
//                         token,
//                         user: { id: user._id, email: user.email }
//                     });
//                 }
//             );
//         } else {
//             return res.status(400).json({ msg: 'Invalid credentials' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const tokens = generateTokens(user._id);
      console.log("Generated Tokens:", tokens);

      res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: { id: user._id, email: user.email },
      });
    } else {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.post("/token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ msg: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    const tokens = generateTokens(user._id);

    res.json(tokens);
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "Token refresh failed" });
  }
});

router.get("/user", async (req, res) => {
  try {
    const user = await User.find({});

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export { router as authRouter };
