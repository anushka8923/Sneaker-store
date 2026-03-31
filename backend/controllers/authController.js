import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//signup user
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//login user
export const loginUser = async (req, res) =>{
  console.log("BODY:", req.body); 
  try{
    const { email, password } = req.body;

        //check if user already exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //compare password
    const match = await bcrypt.compare(password , user.password);
    if(!match){
      return res.status(400).json({ message :" Invalid credentials "})
    }

    //generate JWT token
    const token = jwt.sign(
      {id:user._id },
      process.env.JWT_SECRET,
      { expiresIn : "7d"}
    );
    res.json({
      message:"Login successful",
      token,
      user:{
        _id:user._id,
        name:user.name,
        email:user.email
      }
    });

  } catch(error){
    res.status(500).json({ message:"Server error",error});
  }
};


