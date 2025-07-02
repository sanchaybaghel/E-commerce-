# 🚀 E-Commerce Backend (Node.js)

This is the backend API server for the E-Commerce platform, built with Node.js, Express, and MongoDB.

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Firebase Admin** - Authentication and user management
- **Stripe** - Payment processing and webhooks
- **Cloudinary** - Image storage and management
- **Nodemailer** - Email notifications
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and security
- **Multer** - File upload handling

## 📁 Project Structure

```
server/
├── config/             # Configuration files
│   ├── firebase.js     # Firebase Admin SDK setup
│   └── serviceAccountKey.json  # Firebase service account (local only)
├── controllers/        # Route controllers
│   ├── authController.js       # Authentication logic
│   ├── productController.js    # Product management
│   ├── cartController.js       # Shopping cart operations
│   ├── orderController.js      # Order management
│   ├── paymentController.js    # Stripe payment processing
│   ├── userController.js       # User management
│   └── AdminController.js      # Admin operations
├── middleware/         # Custom middleware
│   └── auth.js         # Authentication middleware
├── models/             # Database models
│   ├── User.js         # User schema
│   ├── Product.js      # Product schema
│   └── Order.js        # Order schema
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── product.js      # Product routes
│   ├── cart.js         # Cart routes
│   ├── order.js        # Order routes
│   ├── payment.js      # Payment routes
│   ├── user.js         # User routes
│   ├── Admin.js        # Admin routes
│   └── protectedroute.js # Protected route utilities
├── utils/              # Utility functions
│   └── cloudinary.js   # Cloudinary configuration
└── index.js            # Main server file
```

## 🔧 Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Server
PORT=4000

# Authentication
JWT_SECRET=your_jwt_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

# Firebase (Production)
FIREBASE_SERVICE_ACCOUNT_KEY=your_base64_encoded_service_account_key
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Firebase project
- Stripe account
- Cloudinary account

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
Create a `.env` file with the required environment variables (see above).

### 3. Firebase Setup
For local development, place your Firebase service account key file as:
```
server/config/serviceAccountKey.json
```

For production, use the base64 encoded environment variable.

### 4. Start the Server

**Development mode (with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:4000`

## 📜 Available Scripts

### `npm start`
Starts the server in production mode.

### `npm run dev`
Starts the server in development mode with nodemon for auto-restart.

## 🛡️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get specific order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Payments
- `POST /api/payment/create-intent` - Create Stripe payment intent
- `POST /api/payment/webhook` - Stripe webhook handler

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/analytics` - Get sales analytics

## 🔐 Authentication & Security

### Firebase Authentication
- JWT token-based authentication
- Firebase Admin SDK for token verification
- Role-based access control (customer/admin)

### Security Features
- Password hashing with bcryptjs
- CORS protection
- Input validation and sanitization
- Protected routes with middleware
- Secure environment variable handling

## 💳 Payment Processing

### Stripe Integration
- Secure payment intent creation
- Webhook handling for payment confirmation
- Order creation after successful payment
- Refund processing capabilities

## 📧 Email Notifications

### Nodemailer Setup
- Order confirmation emails
- Payment receipt notifications
- Account verification emails
- Password reset functionality

## 🖼️ File Upload

### Cloudinary Integration
- Product image upload and storage
- Image optimization and transformation
- Secure URL generation
- Multiple format support

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  role: String (customer/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String (Cloudinary URL),
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  user: ObjectId (ref: User),
  items: [{ product: ObjectId, quantity: Number, price: Number }],
  totalAmount: Number,
  status: String,
  paymentIntentId: String,
  shippingAddress: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

The backend can be deployed to various platforms:

### Railway (Recommended)
```bash
# Connect to Railway and deploy
railway login
railway link
railway up
```

### Render
```bash
# Deploy to Render with environment variables
```

### Heroku
```bash
# Deploy to Heroku
heroku create your-app-name
git push heroku main
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📊 Monitoring & Logging

- Request logging middleware
- Error handling and logging
- Performance monitoring
- Database connection monitoring

## 🤝 Contributing

1. Follow RESTful API conventions
2. Use proper error handling
3. Validate all inputs
4. Write tests for new endpoints
5. Follow the existing code structure

## 📄 License

This project is part of the E-Commerce platform and follows the same MIT license.

---

**Built with ⚡ using Node.js and modern backend technologies**
