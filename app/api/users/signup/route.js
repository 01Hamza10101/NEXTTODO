import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '../../db/connectdb';
import User from "../../models/user.model"; // Adjust the path to your User model

export async function POST(request) {
  try {
    // Parse the request body
    const { Name, Email, Password } = await request.json();
    
    // Log for debugging (can be removed in production)
    console.log('Request Body:', { Name, Email, Password });

    // Connect to MongoDB
    await connectDB();

    // Check for missing fields
    if (!Name || !Email || !Password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ Email: Email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create new user
    const newUser = new User({
      Name: Name,
      Email: Email.toLowerCase(),
      Password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message (exclude password from response)
    return NextResponse.json({
      message: 'User signed up successfully',
      user: {
        id: newUser._id,
        Name: newUser.Name,
        Email: newUser.Email,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
