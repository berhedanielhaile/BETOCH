# BETOCH - Direct Property Rental Platform

A modern property rental platform that connects tenants directly with landlords, eliminating middlemen and reducing costs. Built with Node.js, Express, MongoDB, and featuring a responsive design with real-time search and booking capabilities.

## 🌟 Features

### For Tenants
- **Direct Rental Access**: Browse and contact landlords directly without intermediaries
- **Advanced Search**: Filter properties by location, price, type, and amenities
- **Real-time Enquiries**: Send rental requests and track status in real-time
- **Responsive Design**: Mobile-first design that works seamlessly on all devices
- **Secure Authentication**: JWT-based authentication with secure password hashing

### For Landlords
- **Property Management**: Easily create, edit, and manage property listings
- **Enquiry Management**: Review and respond to tenant requests
- **Dashboard Analytics**: Track property performance and enquiry status
- **Photo Upload**: Upload multiple property photos with automatic optimization
- **Approval Workflow**: Admin approval system for property listings

### Technical Features
- **Error Handling**: Comprehensive error handling with development/production modes
- **Security**: Helmet.js security headers, rate limiting, input sanitization
- **Performance**: Optimized CSS/JS builds, image compression, caching
- **Responsive Design**: Mobile-first architecture with progressive enhancement
- **SEO Friendly**: Clean URLs, semantic HTML, proper meta tags

## 🛠 Tech Stack

### Backend
- **Node.js** (>=10.0.0) - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Sharp** - Image processing
- **Nodemailer** - Email functionality

### Frontend
- **Pug** - Template engine
- **Sass/SCSS** - CSS preprocessing
- **Parcel** - JavaScript bundling
- **PostCSS/Autoprefixer** - CSS vendor prefixes
- **Axios** - HTTP client
- **Vanilla JavaScript** - No frontend frameworks

### Development Tools
- **Nodemon** - Auto-restart server
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **npm-run-all** - Run multiple scripts

## 📦 Installation

### Prerequisites
- Node.js (>=10.0.0)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 1: Clone the repository
```bash
git clone https://github.com/berhedanielhaile/BETOCH.git
cd BETOCH
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Set up environment variables
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
DATABASE=mongodb://localhost:27017/betoch
# Or use MongoDB Atlas:
# DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/betoch

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Step 4: Build assets
```bash
npm run build:css
npm run build:js
```

### Step 5: Start the server
```bash
# Development mode
npm start

# Production mode
npm run start:prod
```

## 🚀 Available Scripts

### Development
- `npm start` - Start development server with nodemon
- `npm run start:prod` - Start server in production mode
- `npm run watch:sass` - Watch Sass files and auto-compile
- `npm run start:sass` - Start dev server with Sass watch
- `npm run watch:js` - Watch JavaScript files and auto-bundle

### Build
- `npm run build:css` - Compile, prefix, and compress CSS
- `npm run compile:sass` - Compile Sass to CSS
- `npm run prefix:css` - Add vendor prefixes to CSS
- `npm run compress:css` - Compress CSS for production
- `npm run build:js` - Bundle JavaScript for production

## 📁 Project Structure

```
BETOCH/
├── controllers/          # Request handlers
│   ├── auth-controller.js
│   ├── error-controller.js
│   ├── property-controller.js
│   ├── user-controller.js
│   └── view-controller.js
├── models/              # Mongoose models
│   ├── Property.js
│   ├── User.js
│   └── Enquiry.js
├── routes/              # Express routes
│   ├── auth-routes.js
│   ├── property-routes.js
│   ├── user-routes.js
│   └── view-routes.js
├── utils/               # Utility functions
│   ├── catchAsync.js
│   ├── AppError.js
│   ├── email.js
│   └── apiFeatures.js
├── views/               # Pug templates
│   ├── base.pug
│   ├── homepage.pug
│   ├── property-listings.pug
│   └── ...
├── public/              # Static assets
│   ├── css/            # Compiled CSS
│   ├── js/             # JavaScript files
│   ├── img/            # Images
│   └── sass/           # Sass source files
├── .gitignore
├── .env
├── app.js              # Express app setup
├── server.js           # Server entry point
└── package.json
```

## 🔧 Configuration

### Environment Variables
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `DATABASE` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration time
- `EMAIL_HOST` - SMTP server host
- `EMAIL_PORT` - SMTP server port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASSWORD` - SMTP password

### Database Connection
The application uses MongoDB. Ensure your MongoDB server is running before starting the application.

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/users/signup` - Register new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout

### Properties
- `GET /api/v1/properties` - Get all properties with filtering
- `GET /api/v1/properties/:id` - Get single property
- `POST /api/v1/properties` - Create new property (landlord only)
- `PATCH /api/v1/properties/:id` - Update property (landlord only)
- `DELETE /api/v1/properties/:id` - Delete property (landlord only)

### Enquiries
- `POST /api/v1/enquiries` - Send rental enquiry
- `GET /api/v1/enquiries` - Get user enquiries
- `PATCH /api/v1/enquiries/:id` - Update enquiry status

### View Routes
- `GET /` - Homepage
- `GET /property-listings` - Property listings page
- `GET /:slug` - Property detail page
- `GET /login` - Login page
- `GET /signup` - Signup page
- `GET /dashboard` - User dashboard
- `GET /post-listing` - Post property form

## 🐛 Error Handling

The application includes comprehensive error handling:
- **Development Mode**: Detailed error messages with stack traces
- **Production Mode**: Generic error messages for security
- **404 Handling**: Custom error page for missing routes
- **Validation Errors**: User-friendly validation messages
- **API Errors**: JSON responses for API requests

## 🔒 Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: Prevent brute force attacks
- **Input Sanitization**: XSS and NoSQL injection prevention
- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **CORS**: Cross-origin resource sharing configuration

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Breakpoints**: 600px, 800px, 1000px, 1200px
- **Touch-friendly**: Optimized for touch interactions
- **Performance**: Lazy loading, image optimization
- **Accessibility**: ARIA labels, semantic HTML

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Initial Developer**: Jonas
- **Current Maintainer**: Daniel Haile

## 🙏 Acknowledgments

- Inspired by the need for direct landlord-tenant connections in Ethiopia
- Built to reduce rental costs and improve transparency in the property market

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This is a private property rental platform. All user data and property information are confidential and protected by applicable data protection laws.