# VPAA System - Virtual Pass & Attendance Application

## 📋 Project Overview
A comprehensive web-based attendance management system using QR code technology for educational institutions. The system allows administrators to manage events, track attendance, and generate certificates for participants.

## 🚀 Features
- **QR Code Attendance**: Quick check-in/check-out using QR codes
- **User Management**: Admin, Professor, and Student roles
- **Event Management**: Create and manage events/classes
- **Certificate Generation**: Automatic certificate creation for attendees
- **Real-time Dashboard**: Live attendance tracking
- **Mobile Responsive**: Works on desktop and mobile devices

## 🛠️ Technology Stack
- **Frontend**: React.js, React Router, QR Scanner
- **Backend**: Django, Django REST Framework
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Authentication**: JWT Token-based authentication

## 📁 Project Structure
```
├── frontend/          # React.js frontend application
├── vpaasystem/        # Django backend application
├── certs/            # Certificate storage
└── requirements.txt   # Python dependencies
```

## 🔧 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd vpaasystem
   ```

2. Install Python dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

5. Start Django server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start React development server:
   ```bash
   npm start
   ```

## 🔒 Security Features
- JWT Authentication
- CORS Protection
- XSS Protection
- CSRF Protection
- Secure Headers Implementation
- Role-based Access Control

For detailed security information, see [SECURITY.md](SECURITY.md)

## 📱 Usage
1. **Admin**: Manage users, create events, view attendance reports
2. **Professor**: Create classes, track student attendance
3. **Student**: Check-in to events, view attendance history, download certificates

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License
This project is for educational purposes.

## 👥 Team
- [Your Team Members Here]

## 📞 Support
For questions or support, please contact [your-email@example.com]