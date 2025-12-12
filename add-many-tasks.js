import mongoose from 'mongoose';

// Connect
await mongoose.connect('mongodb://localhost:27017/todoapp');

// Get collection
const todos = mongoose.connection.db.collection('todos');

// INSERT MANY TASKS AT ONCE
await todos.insertMany([
    {
        text: "Your task 1",
        completed: false,
        priority: "high",
        createdAt: new Date()
    },
    {
        text: "Your task 2",
        completed: false,
        priority: "medium",
        createdAt: new Date()
    },
    {
        text: "Your task 3",
        completed: true,
        priority: "low",
        createdAt: new Date()
    }
]);

console.log('✅ 3 tasks added!');

// Close
await mongoose.connection.close();
