import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage as fallback
let todos = [];
let nextId = 1;

// Connect to MongoDB with fallback to in-memory storage
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Falling back to in-memory storage');
    return false;
  }
};

// Todo Schema for MongoDB
const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Todo = mongoose.model('Todo', todoSchema);

// API Routes with MongoDB and in-memory fallback

// GET all todos
app.get('/api/todos', async (req, res) => {
    try {
        const isMongoConnected = mongoose.connection.readyState === 1;
        if (isMongoConnected) {
            const todos = await Todo.find().sort({ createdAt: -1 });
            res.json(todos);
        } else {
            res.json(todos);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE new todo
app.post('/api/todos', async (req, res) => {
    try {
        const { text, priority } = req.body;
        const isMongoConnected = mongoose.connection.readyState === 1;
        
        if (isMongoConnected) {
            const newTodo = new Todo({
                text,
                priority: priority || 'medium',
                completed: false
            });
            const savedTodo = await newTodo.save();
            res.status(201).json(savedTodo);
        } else {
            const newTodo = {
                _id: nextId++,
                text,
                priority: priority || 'medium',
                completed: false,
                createdAt: new Date()
            };
            todos.push(newTodo);
            res.status(201).json(newTodo);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// UPDATE todo
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { text, completed, priority } = req.body;
        const isMongoConnected = mongoose.connection.readyState === 1;
        
        if (isMongoConnected) {
            const updatedTodo = await Todo.findByIdAndUpdate(
                req.params.id,
                { text, completed, priority },
                { new: true, runValidators: true }
            );
            if (!updatedTodo) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            res.json(updatedTodo);
        } else {
            const id = parseInt(req.params.id);
            const todoIndex = todos.findIndex(t => t._id === id);
            if (todoIndex === -1) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            todos[todoIndex] = {
                ...todos[todoIndex],
                text: text || todos[todoIndex].text,
                completed: completed !== undefined ? completed : todos[todoIndex].completed,
                priority: priority || todos[todoIndex].priority
            };
            res.json(todos[todoIndex]);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE single todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const isMongoConnected = mongoose.connection.readyState === 1;
        
        if (isMongoConnected) {
            const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
            if (!deletedTodo) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            res.json({ message: 'Todo deleted successfully' });
        } else {
            const id = parseInt(req.params.id);
            const todoIndex = todos.findIndex(t => t._id === id);
            if (todoIndex === -1) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            todos.splice(todoIndex, 1);
            res.json({ message: 'Todo deleted successfully' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE all completed todos
app.delete('/api/todos/completed/all', async (req, res) => {
    try {
        const isMongoConnected = mongoose.connection.readyState === 1;
        
        if (isMongoConnected) {
            const result = await Todo.deleteMany({ completed: true });
            res.json({ message: `Deleted ${result.deletedCount} completed todos` });
        } else {
            const initialLength = todos.length;
            todos = todos.filter(todo => !todo.completed);
            res.json({ message: `Deleted ${initialLength - todos.length} completed todos` });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    const isMongoConnected = mongoose.connection.readyState === 1;
    res.json({ 
        status: 'Server running', 
        mongodb: isMongoConnected ? 'Connected' : 'Disconnected - Using in-memory storage'
    });
});

// Start server and attempt MongoDB connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📡 API available at http://localhost:${PORT}/api/todos`);
        if (mongoose.connection.readyState !== 1) {
            console.log(`💾 Using in-memory storage for todos`);
        } else {
            console.log(`💾 MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp'}`);
        }
    });
});