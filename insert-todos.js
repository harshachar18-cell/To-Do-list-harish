import mongoose from 'mongoose';

// Connect to MongoDB
await mongoose.connect('mongodb://localhost:27017/todoapp');
console.log('✅ Connected to MongoDB\n');

// Get the todos collection
const todosCollection = mongoose.connection.db.collection('todos');

// ========================================
// SIMPLE INSERT OPERATIONS
// ========================================

// 1. INSERT ONE TODO
console.log('1️⃣ Inserting ONE todo...');
const result1 = await todosCollection.insertOne({
    text: "Complete MongoDB tutorial",
    completed: false,
    priority: "high",
    createdAt: new Date()
});
console.log('✅ Inserted ID:', result1.insertedId);
console.log('');

// 2. INSERT MULTIPLE TODOS AT ONCE
console.log('2️⃣ Inserting MULTIPLE todos...');
const result2 = await todosCollection.insertMany([
    {
        text: "Buy groceries",
        completed: false,
        priority: "medium",
        createdAt: new Date()
    },
    {
        text: "Call mom",
        completed: true,
        priority: "high",
        createdAt: new Date()
    },
    {
        text: "Read a book",
        completed: false,
        priority: "low",
        createdAt: new Date()
    }
]);
console.log('✅ Inserted', result2.insertedCount, 'todos');
console.log('');

// 3. VIEW ALL TODOS
console.log('3️⃣ Viewing ALL todos in database:');
const allTodos = await todosCollection.find().toArray();
console.log('📋 Total todos:', allTodos.length);
console.log('');
allTodos.forEach((todo, index) => {
    console.log(`${index + 1}. [${todo.completed ? '✓' : ' '}] ${todo.text} (${todo.priority})`);
});

// Close connection
await mongoose.connection.close();
console.log('\n✅ Done! Connection closed.');
process.exit(0);
