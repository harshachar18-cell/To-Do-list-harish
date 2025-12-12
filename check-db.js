import mongoose from 'mongoose';

// Connect to MongoDB
await mongoose.connect('mongodb://localhost:27017/todoapp');

console.log('✅ Connected to MongoDB');

// Get all todos
const todos = await mongoose.connection.db.collection('todos').find().toArray();

console.log('\n📋 Total Todos:', todos.length);
console.log('\n📝 Todos in Database:\n');
console.log(JSON.stringify(todos, null, 2));

// Close connection
await mongoose.connection.close();
console.log('\n✅ Connection closed');
process.exit(0);
