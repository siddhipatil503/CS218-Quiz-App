# Quiz App

This is a full-stack Quiz Application developed using **React** for the frontend and **Flask** for the backend.

## 🚀 API Documentation

### Authentication
- `POST /register` - Register a new user (student or admin)
- `POST /login` - Login and receive a JWT token

### Admin Endpoints
- `POST /quizzes` - Create a new quiz
- `GET /quizzes` - List all quizzes
- `PUT /quizzes/<quiz_id>` - Update quiz title
- `POST /quizzes/<quiz_id>/questions` - Add questions
- `GET /quizzes/<quiz_id>` - View quiz details
- `GET /quiz-scores/<quiz_id>` - View scores by student

### Student Endpoints
- `GET /quizzes` - View available quizzes
- `GET /quizzes/<quiz_id>/attempt` - Fetch quiz to attempt
- `POST /quizzes/<quiz_id>/submit` - Submit quiz and get score
- `GET /my-scores` - View scores of attempted quizzes

## 🛠️ Implementation Details

- **Backend**: Flask, Flask-Bcrypt, Flask-CORS, Flask-JWT-Extended
- **Frontend**: React + Tailwind CSS
- **Database**: SQLite (via SQLAlchemy)
- **Containerization**: Docker and Docker Compose
- **Security**: JWT for authentication, role-based access
- **CI/CD**: GitHub Actions + DockerHub

## ✅ Test Cases

Tested using:
- Postman collections for backend routes
- Manual quiz creation, submission, and score display for frontend

## 🔐 Security

- JWT tokens are used for secure access control
- Students and admins have different dashboard access
- Passwords hashed using `bcrypt`

## ⚙️ Software Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Flask, SQLAlchemy
- **Database**: SQLite
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Cloud Deployment**: AWS (EC2)

## 🗺 Architecture Diagram

```
+------------------------+       +------------------------+
|    React Frontend      | <---> |     Flask Backend       |
| (Dockerized, Port 3000)|       | (Dockerized, Port 5000) |
+------------------------+       +------------------------+
        |                                      |
        +---------------- AWS -----------------+
        |                 EC2                  |
        +--------------------------------------+
```

## 📦 Setup

```bash
# Clone repo
git clone [https://github.com/siddhipatil503/Quiz-App-]

# Start the app
docker-compose up --build

# App will be available at:
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```
