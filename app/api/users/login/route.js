import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import connectDB from '../../db/connectdb';
import User from '../../models/user.model'; // Adjust the path to your User model

// Secret key for JWT (keep this in your environment variables)
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your_jwt_secret_key';

export async function POST(request) {
  try {
    // Parse the request body
    const { Email, Password } = await request.json();
    console.log(Email, Password);

    // Connect to MongoDB
    await connectDB();

    // Check for missing fields
    if (!Email || !Password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // Find the user by Email (ensure that field Names are correctly matched)
    const user = await User.findOne({ Email: Email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.Email }, // Payload data
      JWT_SECRET,                         // Secret key
      { expiresIn: '1000h' }                 // Token expiration time (1 hour)
    );

    // If successful, return the user details and the token
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        Name: user.Name,
        Email: user.Email,
      },
      token,  // Return the generated JWT token
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
