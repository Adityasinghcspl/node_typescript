import asyncHandler from "express-async-handler";
import { Request, Response } from 'express';
import { generateToken } from "../middlewares/validateTokenHandler";
import { hashPassword, comparePasswords } from "../middlewares/hashPassword";
import User from '../models/userModel';

// req.params is used to get the ---- route variables
// req.body is used to get the HTTP requeste data -----  HTTP request body


//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, email, password }: { username: string, email: string, password: string } = req.body;
  console.log(username, email, password)
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});


//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string, password: string } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await comparePasswords(password, user.password))) {
    const accessToken: string = generateToken({
      _id: user._id,
      email: user.email,
      username: user.username

    });
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

//@desc Current user info
//@route POST /api/users/current
//@access private
interface CustomRequest extends Request {
  user?: any; // Adjust 'any' to match the type of your 'user' property
}
const currentUser = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  res.json(req.user);
});

export { registerUser, loginUser, currentUser }