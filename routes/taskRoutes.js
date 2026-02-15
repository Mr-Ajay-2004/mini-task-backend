const express = require("express");
const Task = require("../Models/Task");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create Task
router.post("/", auth, async (req, res) => {
  const task = await Task.create({
    ...req.body,
    user: req.user,
  });
  res.json(task);
});

// Get Tasks (Filter + Sort)
router.get("/", auth, async (req, res) => {
  const { status, sort } = req.query;

  let filter = { user: req.user };
  if (status) filter.status = status;

  let query = Task.find(filter);

  if (sort === "asc") query = query.sort({ createdAt: 1 });
  if (sort === "desc") query = query.sort({ createdAt: -1 });

  const tasks = await query;
  res.json(tasks);
});

// Update Task
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  res.json(task);
});

// Delete Task
router.delete("/:id", auth, async (req, res) => {
  await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user,
  });
  res.json({ message: "Task deleted" });
});

module.exports = router;
