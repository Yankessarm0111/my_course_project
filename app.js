const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// تكوين Mongoose للاتصال بقاعدة البيانات MongoDB
mongoose.connect('mongodb://localhost:27017/tasks', { useNewUrlParser: true, useUnifiedTopology: true });

// تحديد هيكل البيانات لمهمة واحدة
const taskSchema = new mongoose.Schema({
  description: String,
});

const Task = mongoose.model('Task', taskSchema);

app.use(bodyParser.json());

// إضافة مهمة
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task({
      description: req.body.description,
    });

    const savedTask = await task.save();
    res.json(savedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// الحصول على جميع المهام
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// حذف مهمة
app.delete('/tasks/:taskId', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
