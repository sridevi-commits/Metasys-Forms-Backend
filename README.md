# Metasys Forms Backend

Enterprise-grade form submission backend with email notifications, file storage, and rate limiting.

## Features

✨ **Multiple Form Types**
- Contact Form
- Proposal Request Form (with file upload)
- Newsletter Subscription

🔐 **Security**
- Rate limiting per form type
- Input validation
- IP tracking
- User agent logging
- CORS protection
- Helmet security headers

📧 **Email Notifications**
- Separate inboxes for each form type
- Beautiful HTML email templates
- Automatic retry for failed emails
- Support for Postmark and SMTP

💾 **Data Storage**
- PostgreSQL database with Prisma ORM
- MinIO for file storage (S3-compatible)
- Redis for rate limiting
- Automatic submission retry mechanism

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 13
- Redis >= 6
- MinIO (optional, for file uploads)

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd metasys-forms-backend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/metasys_forms"
REDIS_HOST=localhost
REDIS_PORT=6379
POSTMARK_API_KEY=your_api_key
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## API Endpoints

### Health Check
```http
GET /api/health
```

### Contact Form
```http
POST /api/forms/contact
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "company": "Tech Corp",
  "message": "Your message here"
}
```

### Proposal Request
```http
POST /api/forms/proposal
Content-Type: multipart/form-data

firstName: Jane
lastName: Smith
email: jane@example.com
phone: +1-555-0456
company: Innovation Inc
projectType: web
budget: $50k-$100k
timeline: 3-6 months
description: Project description
resumeFile: [file upload]
```

### Newsletter Subscription
```http
POST /api/forms/newsletter
Content-Type: application/json

{
  "email": "subscriber@example.com",
  "firstName": "Alex",
  "lastName": "Johnson"
}
```

### Newsletter Unsubscribe
```http
POST /api/forms/newsletter/unsubscribe
Content-Type: application/json

{
  "email": "subscriber@example.com"
}
```

## Rate Limits

- **Contact Form**: 3 submissions per 15 minutes
- **Proposal Form**: 2 submissions per hour
- **Newsletter**: 3 subscriptions per 24 hours

## Project Structure

```
metasys-forms-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   └── server.ts        # Main application
├── prisma/
│   └── schema.prisma    # Database schema
├── tests/               # Test files
└── logs/                # Application logs
```

## Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm test                 # Run tests
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port | No (default: 3000) |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_HOST` | Redis host | Yes |
| `REDIS_PORT` | Redis port | Yes |
| `POSTMARK_API_KEY` | Postmark API key | Yes* |
| `SMTP_HOST` | SMTP host (alternative to Postmark) | Yes* |
| `SMTP_USER` | SMTP username | Yes* |
| `SMTP_PASS` | SMTP password | Yes* |
| `MINIO_ENDPOINT` | MinIO endpoint | Yes |
| `MINIO_ACCESS_KEY` | MinIO access key | Yes |
| `MINIO_SECRET_KEY` | MinIO secret key | Yes |

*Either Postmark or SMTP configuration is required

## Testing

### Using cURL

```bash
# Test contact form
curl -X POST http://localhost:3000/api/forms/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "message": "Test message"
  }'
```

### Using Postman

1. Import the provided Postman collection
2. Set base URL to `http://localhost:3000`
3. Test each endpoint

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": []  // Validation errors if applicable
}
```

## Logging

Logs are written to:
- Console (colored output in development)
- Files in `logs/` directory (one file per day)

Log levels: `INFO`, `WARN`, `ERROR`, `DEBUG`

## Database Schema

### FormSubmission
- `id`: UUID
- `formType`: CONTACT | PROPOSAL | NEWSLETTER
- `ipAddress`: String
- `userAgent`: String
- `payload`: JSON
- `status`: PENDING | PROCESSED | FAILED | RETRYING
- `emailSent`: Boolean
- `emailError`: String
- `retryCount`: Integer
- `resumeFileUrl`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Newsletter
- `id`: UUID
- `email`: String (unique)
- `firstName`: String
- `lastName`: String
- `isActive`: Boolean
- `ipAddress`: String
- `confirmedAt`: DateTime
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Deployment

### Production Build

```bash
npm run build
NODE_ENV=production npm start
```

### Docker Deployment (Coming Soon)

```bash
docker-compose up -d
```

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: support@metasys.com

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request