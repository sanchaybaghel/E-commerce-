# 🛒 Modern E-Commerce Platform

A full-stack e-commerce application built with React, Node.js, and MongoDB. Features a modern design, secure payment processing with Stripe, and comprehensive admin dashboard.

## ✨ Features

### 🛍️ Customer Features
- **User Authentication** - Secure login/signup with Firebase Auth
- **Product Browsing** - Browse products with search and filtering
- **Shopping Cart** - Add/remove items with real-time updates
- **Secure Checkout** - Stripe payment integration
- **Order Management** - View order history and track status
- **Responsive Design** - Works perfectly on all devices

### 👨‍💼 Admin Features
- **Admin Dashboard** - Professional enterprise-style interface
- **Product Management** - Add, edit, and delete products
- **Order Management** - View and update order statuses
- **User Management** - View customer information
- **Analytics** - Sales and performance insights
- **Image Upload** - Cloudinary integration for product images

## 🚀 Tech Stack

### Frontend
- **React** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Context API** - State management
- **Stripe Elements** - Payment processing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Firebase Admin** - Authentication
- **Stripe** - Payment processing
- **Cloudinary** - Image storage
- **Nodemailer** - Email notifications

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context providers
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── config/           # Configuration files
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Firebase project
- Stripe account
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/sanchaybaghel/E-commerce-.git
cd E-commerce-
```

### 2. Install dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 3. Environment Variables

**Server (.env):**
```env
MONGO_URI=your_mongodb_connection_string
PORT=4000
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
FIREBASE_SERVICE_ACCOUNT_KEY=your_base64_encoded_service_account_key
```

**Client (.env):**
```env
REACT_APP_STRIPE_KEY=your_stripe_publishable_key
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### 4. Run the application

**Start the backend server:**
```bash
cd server
npm start
```

**Start the frontend development server:**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

## 🔐 Security Features

- **Environment Variables** - All sensitive data stored securely
- **Firebase Authentication** - Secure user authentication
- **JWT Tokens** - Stateless authentication
- **Input Validation** - Server-side validation
- **CORS Protection** - Cross-origin request security
- **Stripe Security** - PCI-compliant payment processing

## 📱 Screenshots

### Customer Interface
- Modern, responsive design
- Intuitive shopping experience
- Secure checkout process

### Admin Dashboard
- Professional enterprise interface
- Comprehensive management tools
- Real-time analytics

## 🚀 Deployment

This application is ready for deployment on platforms like:
- **Frontend**: Vercel, Netlify, Firebase Hosting
- **Backend**: Railway, Render, Heroku, DigitalOcean

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sanchay Baghel**
- GitHub: [@sanchaybaghel](https://github.com/sanchaybaghel)
- Email: sanchaybaghel92@gmail.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Stripe for secure payment processing
- Firebase for authentication services
- Tailwind CSS for the utility-first approach
- MongoDB for the flexible database solution

---

⭐ **Star this repository if you found it helpful!**
