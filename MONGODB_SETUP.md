# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account or log in
3. Click "Build a Database"
4. Choose the FREE tier (M0 Sandbox)
5. Select your preferred cloud provider and region
6. Click "Create Cluster"

## Step 2: Setup Database Access

1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set "Database User Privileges" to "Read and write to any database"
6. Click "Add User"

## Step 3: Setup Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - IP Address: 0.0.0.0/0
4. Click "Confirm"

## Step 4: Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Driver: Node.js" and latest version
5. Copy the connection string

It will look like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 5: Configure Your Application

1. Open the `.env` file in your project root
2. Replace the `MONGODB_URI` with your connection string
3. Replace `<username>` with your database username
4. Replace `<password>` with your database password
5. Add the database name after `.mongodb.net/`: `todolist`

Example:
```
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/todolist?retryWrites=true&w=majority
```

## Step 6: Install Dependencies (if not done)

```bash
npm install
```

## Step 7: Start the Application

### Option 1: Run Backend and Frontend Separately

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### Option 2: Run Both Together (Recommended)

```bash
npm run dev:full
```

## Step 8: Access Your Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/todos
- Health Check: http://localhost:5000/api/health

## Troubleshooting

### Cannot connect to MongoDB
- Check your internet connection
- Verify your MongoDB Atlas IP whitelist includes your current IP
- Ensure your username and password are correct
- Make sure there are no special characters in password (or URL encode them)

### Backend not starting
- Make sure MongoDB URI is correctly set in .env file
- Check if port 5000 is already in use
- Verify all dependencies are installed

### Frontend can't connect to backend
- Ensure backend server is running on port 5000
- Check browser console for CORS errors
- Verify API_URL in src/services/api.js is correct

## API Endpoints

### GET /api/todos
Get all todos

### POST /api/todos
Create new todo
```json
{
  "text": "Learn MongoDB",
  "priority": "high"
}
```

### PUT /api/todos/:id
Update todo
```json
{
  "text": "Updated text",
  "completed": true,
  "priority": "medium"
}
```

### DELETE /api/todos/:id
Delete todo by ID

### DELETE /api/todos/completed/all
Delete all completed todos

---

For more help, visit [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
