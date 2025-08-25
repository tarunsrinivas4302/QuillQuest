# 📋 Full-Featured Blog CMS Backend

A scalable, production-ready **Blog CMS (Content Management System) Backend** built with **Node.js**, providing secure and optimized services for blogging platforms. This backend supports user authentication (JWT + OAuth), blog CRUD operations, comments, image uploads, advanced search, RBAC (admin/user roles), email notifications, caching, queue workers, and more.

---

## ⚙️ Tech Stack

| Layer | Tech Used |
|------|-----------|
| **Runtime** | Node.js (ESM) |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Cache** | Redis |
| **Queue** | RabbitMQ |
| **Image Storage** | Cloudinary |
| **Authentication** | JWT + OAuth (Google, GitHub) |
| **Security** | Helmet, CORS, XSS Clean |
| **Emailing** | SMTP (Brevo) + Worker Queue |
| **Logger** | Morgan + Winston |
| **Search** | MongoDB Atlas Fuzzy Search |
| **DevOps** | Docker, .env configuration |
| **Rate Limiting** | express-rate-limit + RedisStore |
| **RBAC** | Role-based Access Control |

---

## 📊 Architecture Overview

```
ᴾʟʟ Backend
└── src/
    ├── config/              # Configuration files (DB, Cloudinary, Redis, SMTP)
    ├── controllers/         # Controllers for handling routes
    ├── routes/              # Express route definitions
    ├── models/              # Mongoose schemas
    ├── middlewares/         # Auth, error, rate limiter, RBAC, logging
    ├── services/            # Core business logic (search, image, mail)
    ├── workers/             # RabbitMQ email queue consumer
    ├── templates/           # Email HTML templates
    ├── utils/               # JWT, hash, queue, helpers
    ├── logger/              # Winston + log rotation, compression
    └── app.js               # Main Express app config
```

---

## ✅ Implemented Features

### 🔐 Authentication & RBAC
- JWT Access & Refresh Tokens
- OAuth via Google & GitHub
- Password Hashing with bcrypt
- Forgot / Reset Password Flow
- Session secret & validation
- Role-based Access (admin/user)

### 📃 Blog CMS Functionality
- CRUD operations for blogs
- Tagging, categorization
- Image uploads to Cloudinary with buffer hashing to prevent duplicates
- Resize, compress, and format images to WebP under 1MB
- Public & private blog access
- Draft vs Published states

### 📄 Comment & Reaction System
- Users can post and view comments
- Like/Unlike functionality on blogs and comments
- Rate limiting on commenting & liking

### 🔍 Search & Filter
- Fuzzy Search on title, tags, author
- Filter by tags, date range
- Trending tags/category logic

### ✉️ Email Notification System
- Welcome email on registration
- Password reset email with token
- Notifications for comments, likes, blog published
- RabbitMQ queues and a dedicated worker for handling email dispatch
- Modular templates with responsive layout

### ⌛ Logging & Monitoring
- Morgan logs with:
  - request method, url, body, headers, response, and status
- Winston logger:
  - Info & error logs
  - File logs stored in `logs/`
  - Daily compression of old logs
  - Auto cleanup of logs older than 7 days

### 🚀 Performance & Security
- Helmet with CSP configuration
- XSS Clean and CORS policies
- Rate limiting with Redis
- MongoDB indexes for high performance
- Multer with memory storage for fast image processing

---

## 🚫 Not Yet Implemented (Future Enhancements)
- Real-time updates via **Socket.IO** for live comments & likes
- Admin analytics dashboard (user count, most viewed blogs)
- Blog scheduling & publishing timeline
- Blog bookmarking
- Two-factor authentication (2FA)
- Notification settings & unsubscribe preferences

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/blog-backend.git
cd blog-backend
npm install
```

### 2. Create `.env`
Use the provided template below.

### 3. Start Dependencies
```bash
docker-compose up -d
```

### 4. Start the Backend
```bash
npm run dev
```

### 5. Run Email Worker
```bash
node src/workers/email.worker.js
```

---


---

## 🚸‍♂️ Running Cron Jobs
- Compress yesterday's logs
- Delete logs older than 7 days
- Use `node-cron` to schedule and run tasks at midnight

---

## 🌟 Conclusion
This project is a complete **Blog CMS Backend**, ready for production deployment. It supports modern web application requirements, modular file structure, scalable services, and is easy to extend.

---

## 📖 License
MIT

---

> Built with ❤️ by Tarun Srinivas

