# JobTracker

A full-stack job application tracking platform built with **React**, **Spring Boot**, and **PostgreSQL**.

Track job applications, monitor statuses, manage interviews, and view dashboard statistics — all through a clean, responsive web interface with secure JWT authentication.

---

## Features

- User registration and login with JWT authentication
- CRUD operations for job applications
- Application status tracking (Applied, Screening, Interview, Offer, Rejected, Withdrawn)
- Dashboard with real-time statistics from the database
- Search by company name or job title (backend-powered)
- Filter applications by status
- Sort by applied date, company, job title, or status
- Interview tracking per application
- User-specific data isolation (users can only access their own data)
- Frontend and backend validation
- Global exception handling with proper HTTP status codes
- Responsive UI for desktop, tablet, and mobile

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, JavaScript, React Router, Axios, Bootstrap, Vite |
| Backend | Java, Spring Boot, Spring Security, Spring Data JPA, JWT |
| Database | PostgreSQL |
| Build Tools | Maven (backend), npm (frontend) |

---

## Architecture

```
React (Frontend)
    ↓ Axios REST calls
Spring Boot Controller
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (JPA)
    ↓
PostgreSQL Database
```

### Backend Structure

```
com.jobtracker/
├── controller/     → REST API endpoints
├── service/        → Business logic
├── repository/     → Database access
├── entity/         → JPA entities
├── dto/            → Request/Response objects
├── security/       → JWT & Spring Security config
└── exception/      → Global error handling
```

### Database Schema

```
users (1) ──── (many) jobs (1) ──── (many) interviews
```

**users:** id, name, email, password, created_at  
**jobs:** id, company_name, job_title, location, status, job_url, applied_date, salary, job_type, description, notes, created_at, updated_at, user_id  
**interviews:** id, job_id, interview_date, round, type, notes

---

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all user's jobs (`?sortBy=date\|company\|title\|status`) |
| GET | `/api/jobs/{id}` | Get job by ID |
| POST | `/api/jobs` | Create new job |
| PUT | `/api/jobs/{id}` | Update job |
| DELETE | `/api/jobs/{id}` | Delete job |
| GET | `/api/jobs/search?keyword=` | Search jobs |
| GET | `/api/jobs/status/{status}` | Filter by status |
| GET | `/api/jobs/stats` | Dashboard statistics |

### Interviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/{jobId}/interviews` | Get interviews for a job |
| POST | `/api/jobs/{jobId}/interviews` | Add interview |
| PUT | `/api/interviews/{id}` | Update interview |
| DELETE | `/api/interviews/{id}` | Delete interview |

All endpoints except `/api/auth/**` require `Authorization: Bearer <token>` header.

---

## How to Run Locally

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven (or use IntelliJ IDEA's built-in Maven)

### 1. Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE jobtracker;
```

Update credentials in `backend/src/main/resources/application.properties` if needed:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/jobtracker
spring.datasource.username=postgres
spring.datasource.password=postgres
```

Tables are auto-created by Hibernate (`ddl-auto=update`).

### 2. Start Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs at **http://localhost:8080**

> **Tip:** Open the `backend` folder in IntelliJ IDEA and run `JobTrackerApplication.java` directly if Maven is not installed globally.

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

### 4. Test the Application

1. Open http://localhost:5173
2. Register a new account
3. Add job applications
4. Explore dashboard, search, filter, and interview features

---

## Deployment

### Backend (Render / Railway / any Java host)

1. Set environment variables:
   - `DATABASE_URL` — PostgreSQL JDBC URL
   - `DATABASE_USERNAME` — DB username
   - `DATABASE_PASSWORD` — DB password
   - `JWT_SECRET` — Strong secret key (256+ bits)
   - `CORS_ORIGINS` — Your frontend URL
2. Run with profile: `spring.profiles.active=prod`
3. Build: `mvn clean package -DskipTests`
4. Run: `java -jar target/jobtracker-backend-1.0.0.jar`

### Frontend (Vercel / Netlify)

1. Set environment variable: `VITE_API_URL=https://your-backend-url/api`
2. Build: `npm run build`
3. Deploy the `dist/` folder

### Database (Neon / Supabase / Railway)

Create a PostgreSQL instance and use the connection string as `DATABASE_URL`.

---

## Future Improvements

- Email notifications for interview reminders
- Export applications to CSV/PDF
- Profile page with resume link
- Application deadline tracking
- Dark mode theme
- Pagination for large job lists

---

## Resume Description

**JobTracker — Full-Stack Job Application Tracking Platform**

Built a full-stack job application tracking platform using React, Spring Boot and PostgreSQL, enabling users to securely manage, search, filter and monitor job applications, interviews and application statuses through REST APIs and a responsive dashboard.

- Developed a responsive React frontend for managing job applications with search, filtering, CRUD operations and dashboard statistics.
- Built RESTful APIs using Spring Boot, Spring Data JPA and PostgreSQL following Controller-Service-Repository architecture.
- Implemented JWT authentication, validation, exception handling and user-specific authorization to securely manage application data.

---

## License

MIT
