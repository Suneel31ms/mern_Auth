const asyncHandler = require("express-async-handler");
const GoalDB = require("../models/goalModel");


exports.getGoals = asyncHandler(async (req, res) => {
  const goals = await GoalDB.find({user:req.user.id});
  res.status(200).json(goals);
});

exports.setGoals = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  const goal = await GoalDB.create({
    user:req.user.id,
    text: req.body.text,
  });
  res.status(200).json(goal);
});

exports.updateGoals = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const goal = await GoalDB.findById(id);
  if (!goal) {
    res.status(400);
    throw new Error("GoalData not found");
  }

  
  //Check for user
  if(!req.user){
    res.status(401);
    throw new Error("User not found");
  }
  
  //Make sure the logged in user matches the goal user
if(goal.user.toString() !== req.user.id){
  res.status(401)
  throw new Error("User Not matched")
}
  const updatedGoal = await GoalDB.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json(updatedGoal);
});

exports.deleteGoals = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const goal = await GoalDB.findById(id);
  if (!goal) {
    res.status(400);
    throw new Error("GoalData not found");
  }
  
  //Check for user
  if(!req.user){
    res.status(401);
    throw new Error("User not found");
  }
  
  //Make sure the logged in user matches the goal user
if(goal.user.toString() !== req.user.id){
  res.status(401)
  throw new Error("User Not matched")
}
  //  await GoalDB.findByIdAndDelete(id)
  await goal.remove();
  res.status(200).json({ id: id });
});
