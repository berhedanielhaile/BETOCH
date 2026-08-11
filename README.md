# BETOCH - Direct Property Rental Platform

A modern property rental platform that connects tenants directly with landlords, eliminating middlemen and reducing costs.

## 🌟 Features

- **Direct Rental Access**: Browse and contact landlords directly without intermediaries
- **Advanced Search**: Filter properties by location, price, type, and amenities
- **Real-time Enquiries**: Send rental requests and track status in real-time
- **Responsive Design**: Mobile-first design that works seamlessly on all devices
- **Secure Authentication**: JWT-based authentication with secure password hashing
- **Property Management**: Create, edit, and manage property listings
- **Dashboard Analytics**: Track property performance and enquiry status

## 🛠 Tech Stack

### Backend
- Node.js (>=10.0.0)
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt Password Hashing

### Frontend
- Pug Templates
- Sass/SCSS
- Vanilla JavaScript
- Axios HTTP Client

## 📦 Installation

### Prerequisites
- Node.js (>=10.0.0)
- MongoDB
- npm

### Setup

1. Clone the repository
```bash
git clone https://github.com/berhedanielhaile/BETOCH.git
cd BETOCH
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with your configuration

4. Build assets
```bash
npm run build:css
npm run build:js
```

5. Start the server
```bash
npm start
```

## 🚀 Available Scripts

- `npm start` - Start development server
- `npm run start:prod` - Start server in production mode
- `npm run build:css` - Compile, prefix, and compress CSS
- `npm run build:js` - Bundle JavaScript for production

## 📁 Project Structure

```
BETOCH/
├── controllers/     # Request handlers
├── models/         # Database models
├── routes/         # API routes
├── utils/          # Utility functions
├── views/          # Pug templates
├── public/         # Static assets
├── app.js          # Express app setup
└── server.js       # Server entry point
```

## 🔧 Configuration

Set up the following environment variables in a `.env` file:
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `DATABASE` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration time

## 🌐 Main Routes

- `GET /` - Homepage
- `GET /property-listings` - Property listings page
- `GET /:slug` - Property detail page
- `GET /login` - Login page
- `GET /signup` - Signup page
- `GET /dashboard` - User dashboard

## � Security

- JWT Authentication
- Password Hashing with Bcrypt
- Input Sanitization
- Rate Limiting
- Security Headers

## 📱 Responsive Design

- Mobile-first approach
- Touch-friendly interface
- Optimized performance
- Accessibility features

## 📝 License

This project is licensed under the ISC License.

## 👥 Author

- **Daniel Haile** - Developer

---

**Note**: This is a property rental platform. All user data and property information are confidential and protected by applicable data protection laws.