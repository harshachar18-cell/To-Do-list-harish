# Quick Start Guide

## 🚀 Get Your Todo App Running in 5 Minutes!

### Step 1: Install Dependencies (1 minute)
```bash
npm install
```

### Step 2: Setup MongoDB Atlas (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for FREE account
3. Create FREE cluster (M0)
4. Create database user:
   - Username: `todouser`
   - Password: `Todo12345` (or your choice)
   - Save these credentials!

5. Network Access:
   - Click "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Confirm

6. Get Connection String:
   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### Step 3: Configure .env File (30 seconds)

Open `.env` file and replace with your connection string:

```env
MONGODB_URI=mongodb+srv://todouser:Todo12345@cluster0.xxxxx.mongodb.net/todolist?retryWrites=true&w=majority
PORT=5000
```

⚠️ Replace:
- `todouser` with your username
- `Todo12345` with your password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

### Step 4: Start the Application (30 seconds)

**Windows PowerShell:**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm run dev:full"
```

**Or run separately:**

Terminal 1:
```bash
npm run server
```

Terminal 2:
```bash
npm run dev
```

### Step 5: Open Your Browser

Visit: http://localhost:5173

🎉 **Done! Your full-stack MERN todo app is running!**

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] MongoDB Atlas account created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string copied
- [ ] `.env` file updated
- [ ] Both servers running
- [ ] App opened in browser

---

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"
- Check your internet connection
- Verify MongoDB URI in `.env` is correct
- Make sure username/password match
- Check if IP is whitelisted (0.0.0.0/0)

### "Port 5000 already in use"
Change PORT in `.env` to 5001 or another number

### "npm scripts not running" (Windows)
Use: `powershell -ExecutionPolicy Bypass -Command "npm run <script>"`

---

## 🎯 Test Your Setup

1. Add a todo ✅
2. Edit a todo ✏️
3. Mark as complete ✓
4. Delete a todo 🗑️
5. Search todos 🔍
6. Filter (All/Active/Completed) 🎯
7. Refresh page - todos should persist! 💾

---

## 📚 Next Steps

- Read full documentation in [README.md](README.md)
- Check [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed MongoDB guide
- Customize colors and features
- Add your own improvements!

---

**Need help? Check the full README or MongoDB setup guide!**
