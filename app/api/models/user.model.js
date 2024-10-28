import mongoose from 'mongoose';
import { type } from 'os';

const taskSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
    trim: true,
  },
  Description: {
    type: String,
    trim: true,
    maxlength: 500, // Optional: limit description length
  },
  IsCompleted: {
    type: Boolean,
    default: false, // By default, tasks are not completed
  },
  dueDate: {
    type: Date, // Optional due date
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields for tasks
});

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  Email: {
    type: String,
    required: true,
    trim: true,
    unique: true, // Ensures that emails are unique
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Basic email validation
  },
  Password: {
    type: String,
    minlength: 6, // Minimum password length
  },
  Provider:{
    type:String
  },
  Tasks: [taskSchema], // An array of tasks associated with the user
}, {
  timestamps: true, // Adds createdAt and updatedAt fields for users
});

export default mongoose.models.User || mongoose.model('User', userSchema);
