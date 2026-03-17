import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"
import { createUser } from "../models/User"

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  try {
    const newUser: PlatformUser = {
      id: null,
      email,
      password
    };

    // Call the model to save the user to the database
    const createdUser = await createUser(newUser);

    // Respond with a 201 Created status and the user data
    res.status(201).json({ user: createdUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "An error occurred during registration." });
  }
};