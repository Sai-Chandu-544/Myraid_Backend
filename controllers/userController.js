const User = require("../models/userModel");
const Task = require("../models/taskModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/tokenGeneration");
const {encryptData,decryptData}=require("../Service/EncryptionService")


exports.register = async (req, res) => {
  try {

    const { name, email, password } = req.body;


    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered",
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.login = async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id);
res.cookie("token", token, {
  httpOnly: true,
  secure: true,      // required for HTTPS (Vercel + Render)
  sameSite: "none"   // required for cross-domain requests
});

  res.json({
    message: "Login successful"
  });
};



exports.createTask = async (req, res) => {

  const { title, description, status } = req.body;

  const encryptedDescription = encryptData(description);

  const task = await Task.create({
    title,
    description:encryptedDescription,
    status,
    user: req.user
  });

  res.status(201).json(task);
};


// controllers/taskController.js

exports.getTasks = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const skip = (page - 1) * limit;

    const query = { user: req.user }; // tasks of logged-in user

    const totalTasks = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // decrypt description before sending
    const decryptedTasks = tasks.map(task => ({
      ...task._doc,
      description: decryptData(task.description)
    }));

    res.status(200).json({
      tasks: decryptedTasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
      totalTasks
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message
    });

  }
};


exports.getSingleTask = async (req, res) => {

  try {

    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      task
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });

  }

};


exports.updateTask = async (req,res)=>{

try{

const {title,description,status} = req.body;

const task = await Task.findOne({
_id:req.params.id,
user:req.user
});

if(!task){
return res.status(404).json({
message:"Task not found"
});
}

if(title) task.title = title;

if(description){
task.description = encryptData(description);
}

if(status) task.status = status;

await task.save();

res.status(200).json({
success:true,
message:"Task updated"
});

}
catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.deleteTask = async (req,res)=>{

try{

const task = await Task.findOneAndDelete({
_id:req.params.id,
user:req.user
});

if(!task){

return res.status(404).json({
message:"Task not found"
});

}

res.status(200).json({
success:true,
message:"Task deleted"
});

}
catch(error){

res.status(500).json({
message:error.message
});

}

};