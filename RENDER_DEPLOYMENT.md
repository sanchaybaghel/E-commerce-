# 🚀 Deploying Backend to Render

## Prerequisites
- GitHub repository with your backend code
- Render account (free tier available)
- MongoDB Atlas database
- Stripe account with API keys

## Step 1: Prepare Your Repository

1. **Ensure your backend is in the `server` folder**
2. **Verify package.json has correct start script**:
   ```json
   "scripts": {
     "start": "node index.js",
     "dev": "nodemon index.js"
   }
   ```

## Step 2: Create Web Service on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `ecommerce-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## Step 3: Environment Variables

Add these environment variables in Render (use your actual values from .env file):

### Required Variables:
```
MONGO_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_SERVICE_ACCOUNT_KEY=your_base64_encoded_service_account_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=https://your-frontend-domain.com
PORT=5000
```

### Optional Variables:
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 4: Deploy

1. **Click "Create Web Service"**
2. **Wait for deployment** (usually 2-5 minutes)
3. **Your backend will be available at**: `https://your-service-name.onrender.com`

## Step 5: Configure Stripe Webhooks

1. **Go to Stripe Dashboard → Webhooks**
2. **Add endpoint**: `https://your-service-name.onrender.com/api/payment/webhook`
3. **Select events**: `checkout.session.completed`
4. **Copy webhook secret** and update `STRIPE_WEBHOOK_SECRET` in Render

## Step 6: Update Frontend

Update your frontend's API base URL to point to your deployed backend:
```javascript
// In client/src/api/axios.js or similar
const API_BASE_URL = 'https://your-service-name.onrender.com';
```

## Troubleshooting

### Common Issues:
1. **Build fails**: Check if all dependencies are in package.json
2. **Environment variables**: Ensure all required variables are set
3. **CORS errors**: Verify FRONTEND_URL is correct
4. **Database connection**: Check MongoDB URI and network access

### Logs:
- View logs in Render dashboard under "Logs" tab
- Check for startup errors and connection issues

## Free Tier Limitations

Render free tier:
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold start delay (30-60 seconds)
- ✅ Custom domains supported
- ✅ Automatic SSL certificates

## Next Steps

After successful deployment:
1. Test all API endpoints
2. Verify payment flow works
3. Update frontend to use production backend URL
4. Deploy frontend (Vercel/Netlify recommended)