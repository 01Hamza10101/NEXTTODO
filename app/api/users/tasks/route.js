import { NextResponse } from 'next/server';
import connectDB from "../../db/connectdb";
import User from "../../models/user.model"; // Ensure the User model path is correct
import jwt from 'jsonwebtoken';

// Token verification function
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY); // JWT secret from .env file
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};
function getdataSession(req) {
    try {
        const cookieValue = req.cookies.get('userSession')?.value;

        if (!cookieValue) {
            return NextResponse.json({ message: "Unauthorized: No session data found" }, { status: 401 });
        }

        let sessionData;
        try {
            sessionData = JSON.parse(cookieValue); 
        } catch (error) {
            console.error("Failed to parse cookie:", error);
            return NextResponse.json({ message: "Invalid session format" }, { status: 400 });
        }
        
        if (!sessionData?.id) {
            return NextResponse.json({ message: "Invalid session data" }, { status: 401 });
        }
        return sessionData;
    } catch (error) {
        return console.log(error);
    }
}
export async function GET(req) {
    try {
        await connectDB();

        let data = await getdataSession(req);
        // console.log(data)
        const userTasks = await User.findOne({Email:data?.email}).populate("Tasks");
        if (!userTasks) {
            return NextResponse.json({ message: "No tasks found for the user" }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Tasks loaded successfully',
            Tasks: userTasks?.Tasks,
            user: { Name: userTasks?.Name, Email: userTasks?.Email }
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ message: "Failed to fetch tasks" }, { status: 500 });
    }
}




export async function POST(req) {
    try {
        // Connect to the database
        await connectDB();

        let data = await getdataSession(req);

        // Parse the request body to get the task details
        const { Title, Description } = await req.json();

        if (!Title || !Description) {
            return NextResponse.json({
                message: "Missing task details",
            }, { status: 400 });
        }

        // Find the user and add the new task to their task list
        const user = await User.findOne({Email:data?.email});
        if (!user) {
            return NextResponse.json({
                message: "User not found",
            }, { status: 404 });
        }

        // Assuming tasks are stored in a field `Tasks` as an array of objects
        user.Tasks.push({ Title, Description });

        // Save the updated user document
        await user.save();
        const UserUpdate = await User.findOne({Email:data?.email});

        return NextResponse.json({
            message: 'Task added successfully',
            Tasks: UserUpdate.Tasks
        }, { status: 201 });
    } catch (error) {
        console.error("Error adding task:", error);
        return NextResponse.json({
            message: "Failed to add task"
        }, { status: 500 });
    }
}


export async function DELETE(req) {
    try {
        await connectDB();
        const taskId = req.nextUrl.searchParams.get("taskId");

        let data = await getdataSession(req);
        const userId = data?.email;
        if (!userId) {
            return NextResponse.json({
                message: "Invalid token data",
            }, { status: 401 });
        }

        if (!taskId) {
            return NextResponse.json({
                message: "Missing task ID",
            }, { status: 400 });
        }

        const user = await User.findOne({Email:data?.email});
        if (!user) {
            return NextResponse.json({
                message: "User not found",
            }, { status: 404 });
        }

        user.Tasks = user.Tasks.filter(task => task._id.toString() !== taskId);

        await user.save();

        return NextResponse.json({
            message: "Task deleted successfully",
            Tasks: user.Tasks,
        }, { status: 200 });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({
            message: "Failed to delete task"
        }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
      await connectDB();
  
      let data = await getdataSession(req);

      const { id, IsCompleted } = await req.json(); 
      const userId = data?.email;
    
      const user = await User.findOne({Email:data?.email});
      if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
  
      const task = user.Tasks.id(id); 
      if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });
  
      task.IsCompleted = IsCompleted; 
      await user.save(); 
  
      return NextResponse.json({ message: 'Task completion status updated'}, { status: 200 });
    } catch (error) {
      console.error("Error updating task:", error);
      return NextResponse.json({ message: "Failed to update task" }, { status: 500 });
    }
  }