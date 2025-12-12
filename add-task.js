import mongoose from 'mongoose';

// Connect
await mongoose.connect('mongodb://localhost:27017/todoapp');

// Get collection
const todos = mongoose.connection.db.collection('todos');

// INSERT ONE TASK - Change the text below to whatever you want
await todos.insertOne({
    text: "My new task",
    completed: false,
    priority: "medium",
    createdAt: new Date()
});

console.log('✅ Task added!');

// Close
await mongoose.connection.close();
