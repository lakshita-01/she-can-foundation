# 🚀 Quick Start Guide

## 📋 Prerequisites
- Python 3.8+ installed
- Node.js 14+ installed
- Git installed

## ⚡ 1-Minute Setup

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
# Clone and setup
git clone https://github.com/lakshita-01/she-can-foundation.git
cd she-can-foundation
setup.bat
```

**Mac/Linux:**
```bash
# Clone and setup
git clone https://github.com/lakshita-01/she-can-foundation.git
cd she-can-foundation
chmod +x setup.sh && ./setup.sh
```

### Option 2: Manual Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/lakshita-01/she-can-foundation.git
   cd she-can-foundation
   ```

2. **Backend Setup**
   ```bash
   cd intern_dashboard
   pip install -r requirements.txt
   python manage.py migrate
   ```

3. **Frontend Setup**
   ```bash
   cd ../intern-dashboard-frontend
   npm install
   ```

## 🏃‍♂️ Running the Application

### Start Backend (Terminal 1)
```bash
cd intern_dashboard
python manage.py runserver
```
✅ Backend runs on: http://localhost:8000

### Start Frontend (Terminal 2)
```bash
cd intern-dashboard-frontend
npm start
```
✅ Frontend opens on: http://localhost:3000

## 🎯 First Login

1. Open http://localhost:3000
2. Click "🚀 Demo Login" for instant access
3. Or enter any name to create a demo account

## 📊 What You'll See

### Dashboard Features
- **Personal Stats**: Total donations, donors, averages
- **Progress Tracking**: Visual progress to next milestone
- **Rewards System**: Unlock achievements as you progress
- **Recent Activity**: Latest donation history
- **Monthly Trends**: Interactive charts

### Leaderboard Features
- **Top 3 Podium**: Special highlighting for leaders
- **Full Rankings**: Complete participant list
- **Achievement Levels**: From Beginner to Legend
- **Real-time Updates**: Live competition data

## 🔧 API Testing

Test the backend API directly:
```bash
# Health check
curl http://localhost:8000/api/test/

# Dashboard data
curl http://localhost:8000/api/intern/1/dashboard/

# Leaderboard
curl http://localhost:8000/api/leaderboard/
```

## 🎨 Demo Data

The application includes realistic demo data:
- 8 sample interns with varying donation amounts
- Achievement system with 5 levels
- Monthly trend data
- Recent donation history

## 🆘 Troubleshooting

### Common Issues

**"Failed to fetch" errors:**
- Ensure Django server is running on port 8000
- Check if both servers are started
- The app will show demo data if API is unavailable

**Port conflicts:**
- Backend: Change port with `python manage.py runserver 8001`
- Frontend: Set PORT=3001 in environment

**Installation issues:**
- Update pip: `pip install --upgrade pip`
- Clear npm cache: `npm cache clean --force`

## 🌟 Next Steps

1. **Explore Features**: Navigate between Dashboard and Leaderboard
2. **Check API**: Test endpoints with different intern IDs
3. **Customize**: Modify demo data in views.py
4. **Deploy**: Follow DEPLOYMENT.md for production setup

## 📞 Support

- 📖 Full documentation: README.md
- 🚀 Deployment guide: DEPLOYMENT.md
- 📊 Project overview: PROJECT_SUMMARY.md
- 🐛 Issues: Create GitHub issue

---

**Ready to track donations and compete! 🎯**