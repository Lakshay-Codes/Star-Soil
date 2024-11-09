# 🌟 Star Soil: Your Gateway to the Cosmos
"The universe is not only stranger than we imagine, it is stranger than we can imagine."

## 🚀 Project Overview
Star Soil is a comprehensive, full-stack platform designed to connect space enthusiasts with celestial opportunities. Built with the MERN (MongoDB, Express, React, Node.js) stack, the platform provides a secure, user-friendly experience for exploring and acquiring celestial properties.

## 🔗 Deployment
Live Link: https://star-soil-q7si.vercel.app

## ✨ Core Features

### 🔐 User Authentication
- Secure user registration and login system
- JWT-based authentication for robust security
- Password encryption using bcryptjs
- Protected routes ensuring user data privacy

### 🌍 Planet Management
- Browse detailed celestial property listings
- Comprehensive property information management
- Advanced filtering and search capabilities
- Interactive celestial maps and visualization (coming soon)

### 💫 Payment Processing
- Seamless transaction workflow
- Integrated Stripe payment processing
- Real-time payment tracking
- Comprehensive purchase history

### 📊 Advanced Reports
- Administrative dashboard with system-wide statistics
- Individual user portfolio tracking
- Property acquisition metrics and insights

## 🛠️ Technology Stack

### Backend
- 🟢 Node.js: Server-side runtime environment
- 🍃 Express.js: Web application framework
- 🍃 MongoDB: NoSQL database for flexible data storage
- 🔐 JSON Web Tokens (JWT): Authentication mechanism
- 💳 Stripe API: Payment processing integration

### Frontend
- ⚛️ React: Component-based user interface library
- 🎨 Ant Design: Professional UI component library
- 🌪️ Tailwind CSS: Utility-first CSS framework
- ⚡ Zustand: Lightweight state management
- 📡 Axios: HTTP request library

## 📁 Project Structure

### Backend Structure
```
star-soil-backend/
├── config/
│   |── db-config.js         # Database configuration
├── middleware/
│   |── index.js             # Authentication middleware
├── models/
│   ├── planet-model.js      # Property data schema
│   ├── payment-model.js     # Payment tracking schema
│   |── user-model.js        # User account schema
├── routes/
│   ├── users-route.js       # User management endpoints
│   ├── planets-route.js     # Property operation routes
│   ├── stripePayment-route.js # Payment processing routes
│   ├── payments-route.js    # Stripe payment integration
│   |── reports-route.js     # Reporting system routes
├── .env                     # Environment configuration
├── app.js                   # Application entry point
|── README.md                # Project documentation
```

### Frontend Structure
```
star-soil-frontend/
├── components/    # Reusable React components
├── layout/       # Page layout components
├── pages/        # Main application views
├── providers/    # Context and theme providers
├── store/        # State management
|── styles/       # Global styling
```

## 🔌 API Endpoint Overview

### User Endpoints (/api/users)
- POST /register: User account creation
- POST /login: User authentication
- GET /current-user: Retrieve user profile
- GET /get-all: List all users (admin)
- GET /get-stats: User payment statistics
- POST /update-password: Password modification

### Property Endpoints (/api/planets)
- POST /create: Property listing creation
- PUT /update/:id: Update property details
- DELETE /delete/:id: Remove property listing
- GET /get-all: List all properties
- GET /get/:id: Fetch specific property details

### Payment Endpoints (/api/stripePayment)
- POST /create: Process new payment
- GET /get-all: View all payments
- GET /get-payments-by-planet/:id: Property-specific payments
- GET /get-payments-by-user/:id: User payment history

### Stripe Integration (/api/payments)
- POST /create-payment-intent: Initialize Stripe payment

### Reports Endpoints (/api/reports)
- GET /admin-reports: System-wide statistics
- GET /user-reports/:id: Individual user reports

## 🔒 Security Measures
- JWT authentication for secure route access
- Bcrypt password hashing
- Environment-based configuration management
- Stripe payment tokenization
- Input validation on all API routes
- Secure storage of sensitive credentials

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn package manager
- MongoDB instance
- Stripe account

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/star-soil.git
cd star-soil
```

2. Install dependencies
```bash
npm install  # or yarn install
```

3. Configure environment variables
Create a .env file with the following:
```
DATABASE_URL=mongodb://your-mongodb-url
JWT_SECRET=your-secure-jwt-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
```

4. Start the development server
```bash
npm run dev  # or yarn dev
```
