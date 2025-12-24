# PROJECT_SAD

🕉️ Pandit Sewa - Online Pandit Booking Platformघरमै बसेर Pandit बुक गर्नुहोस् - Book verified pandits online for all your religious ceremonies in Nepal.

🕉️ Pandit Sewa - Online Pandit Booking Platform
घरमै बसेर Pandit बुक गर्नुहोस् - Book verified pandits online for all your religious ceremonies in Nepal.
Show Image
Show Image
Show Image

📋 Table of Contents

About
Features
Tech Stack
Prerequisites
Installation
Database Setup
Running the Application
API Documentation
Project Structure
Screenshots
Future Enhancements
Contributing
License


🎯 About
Pandit Sewa is a modern web platform that connects customers with verified pandits (Hindu priests) for religious ceremonies and rituals. Whether you need a pandit for Sarad, Rudri, Griha Puja, Bratabandha, or any other ceremony, you can easily book and track your service online.
Why Pandit Sewa?

✅ Verified Pandits - All pandits are experienced and verified
📍 Real-time Tracking - Track your pandit's location like Pathao
💳 Secure Payment - eSewa, Khalti, IME Pay integration (coming soon)
🛍️ Puja Samagri Included - Complete puja materials delivered
⭐ Rating System - Choose based on experience and customer reviews


✨ Features
Customer Features

🔍 Browse verified pandits with ratings and experience
📅 Book puja services with date/time selection
📍 Real-time pandit tracking system
💰 Transparent pricing with no hidden charges
🔔 Booking confirmation and notifications
📊 Booking history and status tracking

Admin Features

📊 Dashboard with booking statistics
👥 Manage all bookings
🔍 Search and filter bookings
📥 Export data to CSV
✏️ Update booking status
🗑️ Delete/cancel bookings

Pandit Features (Coming Soon)

📱 Receive booking requests
✅ Accept/reject bookings
📍 Update availability
💰 Earnings dashboard


🛠️ Tech Stack
Frontend

HTML5 - Structure
CSS3 - Styling with modern gradients and animations
JavaScript (Vanilla) - Dynamic functionality
Responsive Design - Mobile-first approach

Backend

Node.js - Runtime environment
Express.js - Web framework
MySQL - Database
CORS - Cross-origin resource sharing
Body-parser - Request parsing


📦 Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v14 or higher)
MySQL (v8.0 or higher)
Git
A code editor (VS Code recommended)


⚙️ Installation
1. Clone the Repository
bashgit clone https://github.com/yourusername/pandit-sewa.git
cd pandit-sewa
2. Install Backend Dependencies
bashnpm install
This will install:

express
mysql2
cors
body-parser
nodemon (dev dependency)


🗄️ Database Setup
1. Create MySQL Database
Open your MySQL client and run:
bashmysql -u root -p
2. Run the Schema
sqlsource schema.sql
Or manually copy and execute the contents of schema.sql in your MySQL client.
3. Configure Database Connection
Edit db.js and update your MySQL credentials:
javascriptconst pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'YOUR_PASSWORD_HERE',  // Change this
    database: 'pandit_sewa',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
4. Verify Database Setup
The schema will create:

✅ 3 tables: users, pandits, bookings
✅ Sample pandits (4 pandits)
✅ Sample test customer


🚀 Running the Application
1. Start the Backend Server
bash# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

The server will start on **http://localhost:3000**

You should see:
```
╔═══════════════════════════════════════╗
║   🕉️  Pandit Sewa API Server        ║
║   🚀 Running on port 3000            ║
║   🌐 http://localhost:3000          ║
╚═══════════════════════════════════════╝
2. Start the Frontend
Open index.html in your browser, or use a local server:
bash# Using Python
python -m http.server 8000

# Using Node.js http-server (install first: npm install -g http-server)
http-server -p 8000

# Using VS Code Live Server extension
Right-click index.html → Open with Live Server
```

Access the app at **http://localhost:8000**

### 3. Access Admin Dashboard

Open **admin.html** in your browser: **http://localhost:8000/admin.html**

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
Endpoints
Health Check
httpGET /api/health
Pandits
Get All Pandits
httpGET /api/pandits
Get Single Pandit
httpGET /api/pandits/:id
Bookings
Create Booking
httpPOST /api/bookings
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_phone": "9876543210",
  "pandit_id": 1,
  "puja_type": "Sarad",
  "puja_date": "2025-01-15",
  "puja_time": "10:00",
  "location": "Kathmandu, Nepal",
  "notes": "Optional notes"
}
Get All Bookings
httpGET /api/bookings
Get Single Booking
httpGET /api/bookings/:id
Update Booking Status
httpPUT /api/bookings/:id/status
Content-Type: application/json

{
  "status": "confirmed" // pending | confirmed | assigned | on_the_way | completed | cancelled
}
Delete Booking
httpDELETE /api/bookings/:id
```

---

## 📁 Project Structure
```
pandit-sewa/
│
├── index.html              # Main customer-facing page
├── admin.html             # Admin dashboard
├── style.css              # Main stylesheet
├── app.js                 # Frontend JavaScript
│
├── server.js              # Express server
├── db.js                  # Database connection
├── schema.sql             # Database schema
│
├── package.json           # NPM dependencies
├── package-lock.json      # NPM lock file
│
└── README.md             # This file

📸 Screenshots
Homepage
Beautiful hero section with gradient background and featured pandits listing.
Booking Form
Intuitive booking form with date/time picker and location input.
Admin Dashboard
Comprehensive dashboard with statistics, search, and export functionality.
Tracking System
Visual step-by-step tracking similar to food delivery apps.

🔮 Future Enhancements
Phase 1 (Current Sprint)

 Basic booking system
 Admin dashboard
 Pandit listings
 User authentication
 Payment gateway integration

Phase 2

 SMS notifications
 Email confirmations
 Real GPS tracking
 Review and rating system
 Pandit availability calendar

Phase 3

 Mobile app (React Native)
 Advanced search filters
 Multi-language support
 AI-based pandit recommendations
 Video consultation feature


🤝 Contributing
Contributions are welcome! Here's how you can help:

Fork the repository
Create a new branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

Coding Guidelines

Follow existing code style
Write meaningful commit messages
Test your changes before submitting
Update documentation if needed


🐛 Known Issues

 Mobile responsiveness needs improvement on some pages
 Payment gateway integration pending
 Real-time GPS tracking not yet implemented
 SMS notifications require Twilio/similar service


📝 License


👨‍💻 Author
Your Name

GitHub: @yourusername
Email: your.email@example.com


🙏 Acknowledgments

Inspired by modern service booking platforms
Built for the Nepali community
Special thanks to all pandits who preserve our traditions


📞 Support
Need help?

📧 Email: support@panditsewa.com


