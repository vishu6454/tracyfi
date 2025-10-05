# Trackify - Lost & Found Platform

Trackify is a modern web application designed to help people report and find lost items through a community-driven platform. It features a secure admin panel for managing users and listings, with real-time notifications and a responsive design.

## 🚀 Features

### For Users
- **Report Lost/Found Items**: Easy-to-use form with image upload and location detection
- **Browse Listings**: Search and filter through reported items
- **Real-time Notifications**: Get notified when your items are verified
- **User Authentication**: Secure login/signup system
- **Dark/Light Mode**: Toggle between themes for comfortable viewing

### For Administrators
- **Dashboard Overview**: View system statistics and reports
- **User Management**: Manage user accounts and permissions
- **Listing Management**: Verify, edit, or delete item listings
- **Notification System**: Send updates to users about their reports

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Storage**: LocalStorage (for demo purposes)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/trackify.git
   cd trackify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Admin Access

### Default Admin Credentials
- **Email**: `admin@back2u.com`
- **Password**: `admin123`

### Predefined Test User
- **Email**: `vishukanoujiya820@gmail.com`
- **Password**: `vk@12345`

## 🗂️ Project Structure

```
src/
├── Components/
│   ├── AdminLayout/       # Admin panel layout
│   └── Navbar/           # Navigation component
├── Context/
│   ├── AuthContext.js     # Authentication management
│   └── ReportsContext.js  # Reports management
├── pages/
│   ├── AdminPanel/        # Admin dashboard and management
│   ├── AdminLogin/        # Admin login page
│   ├── HomePage/          # Landing page and features
│   ├── LoginPage/         # User login
│   ├── SignupPage/        # User registration
│   ├── ReportItem/        # Item reporting form
│   ├── ViewListing/       # Browse listings
│   └── Notifications/     # User notifications
└── App.js                 # Main application component
```

## 🎯 Key Pages

### Public Pages
- **Home**: Landing page with features overview
- **Login/Signup**: User authentication
- **Admin Login**: Separate admin authentication

### User Pages (Protected)
- **Report Item**: Form to report lost/found items
- **View Listings**: Browse all reported items
- **Notifications**: View system notifications

### Admin Pages (Protected)
- **Dashboard**: System overview and statistics
- **Manage Users**: User account management
- **Manage Listings**: Item verification and management

## 🔒 Authentication System

- **User Roles**: `user` and `admin`
- **Session Management**: Persistent login state
- **Route Protection**: Automatic redirect for unauthorized access
- **Role-based Access**: Different interfaces for users and admins

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 Theming

- **Light Mode**: Clean, professional appearance
- **Dark Mode**: Reduced eye strain for low-light environments
- **Cyberpunk Theme**: Available on authentication pages

## 🔔 Notification System

- **Real-time Updates**: Instant notifications for item verification
- **Unread Count**: Badge showing pending notifications
- **Mark as Read**: Manual and bulk read status management
- **Email-style Interface**: Familiar notification center layout

## 🗄️ Data Storage

Currently uses browser localStorage for demonstration purposes. In a production environment, this would be replaced with:
- Backend API
- Database (MongoDB, PostgreSQL, etc.)
- Cloud storage for images

## 🚀 Deployment

### Build for production
```bash
npm run build
```

### Deploy to your preferred hosting service
- Netlify
- Vercel
- AWS S3 + CloudFront
- Heroku

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Important Notes

- This is a demo application using localStorage - data persists only in the current browser
- For production use, implement proper backend authentication and database storage
- The admin credentials provided are for demonstration purposes only
- Always use strong, unique passwords in production environments

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

**Note**: This application is designed as a portfolio project and demonstration. For production use, additional security measures and a proper backend should be implemented.
