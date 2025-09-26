# Esprit University Study Abroad Platform - Express.js API

A standalone Express.js API server for the Esprit University Study Abroad Platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Admin panel for managing users and permissions
- **Study Offers**: Universities can create and manage study abroad offers
- **Applications**: Students can apply to offers and track their status
- **Recommendations**: Teachers can recommend students for programs
- **Data Export**: Admin can export platform data to Excel
- **Security**: Rate limiting, CORS, helmet security headers

## Quick Start

### 1. Installation

```bash
cd express-api
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/esprit_university
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3001
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Create Dummy Data

Run the script to create sample accounts and data:

```bash
npm run create-dummy
```

This will create:
- 1 Admin account
- 3 Student accounts  
- 2 Teacher accounts
- 3 University accounts
- 3 Study offers

### 5. Start the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Admin Routes (Requires admin role)
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/toggle-status` - Activate/deactivate user
- `POST /api/admin/send-activation-email` - Send activation email
- `GET /api/admin/export` - Export data to Excel

### Student Routes (Requires student role)
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile

### Teacher Routes (Requires teacher role)
- `GET /api/teacher/profile` - Get teacher profile
- `GET /api/teacher/students` - Get all students

### University Routes (Requires university role)
- `GET /api/university/profile` - Get university profile
- `GET /api/university/offers` - Get university's offers
- `POST /api/university/offers` - Create new offer

### Public Routes
- `GET /api/offers` - Get all active offers
- `GET /api/offers/:id` - Get specific offer

### Application Routes (Requires authentication)
- `POST /api/applications` - Submit application (students only)
- `GET /api/applications` - Get user's applications

### Health Check
- `GET /health` - Server health status

## Default Accounts

After running the dummy data script, you can use these accounts:

### Admin
- **Email**: admin@esprit.tn
- **Password**: admin123

### Students
- **Email**: ahmed.ben.ali@esprit.tn | **Password**: student123
- **Email**: fatma.trabelsi@esprit.tn | **Password**: student123
- **Email**: mohamed.gharbi@esprit.tn | **Password**: student123

### Teachers
- **Email**: prof.smith@esprit.tn | **Password**: teacher123
- **Email**: prof.martin@esprit.tn | **Password**: teacher123

### Universities
- **Email**: contact@sorbonne.fr | **Password**: university123
- **Email**: admissions@tum.de | **Password**: university123
- **Email**: international@mit.edu | **Password**: university123

## Project Structure

```
express-api/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── admin.js             # Admin routes
│   ├── student.js           # Student routes
│   ├── teacher.js           # Teacher routes
│   ├── university.js        # University routes
│   ├── offers.js            # Offer routes
│   └── applications.js      # Application routes
├── scripts/
│   └── createDummyAccounts.js # Dummy data creation
├── utils/
│   └── auth.js              # Auth utilities
├── .env.example             # Environment template
├── server.js                # Main server file
└── package.json
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Request validation and sanitization

## Development

### Adding New Routes

1. Create route file in `routes/` directory
2. Import and use in `server.js`
3. Add authentication/authorization middleware as needed

### Database Indexes

The application automatically creates database indexes for optimal performance:
- User email (unique)
- Student Esprit ID (unique)
- User role and status
- Offer fields for filtering

### Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## Testing

You can test the API using tools like:
- Postman
- curl
- Thunder Client (VS Code extension)

Example curl request:

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@esprit.tn","password":"admin123","role":"admin"}'

# Get offers
curl http://localhost:3001/api/offers
```

## Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Use MongoDB Atlas or dedicated MongoDB server
5. Configure proper CORS origins
6. Set strong JWT secret

```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name "esprit-api"
```