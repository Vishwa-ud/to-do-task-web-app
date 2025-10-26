# 📝 To-Do Task Web Application

A modern, full-stack to-do task management application built with React, Spring Boot, and MySQL. This project demonstrates clean code principles, SOLID design, comprehensive testing, and containerized deployment.


### Quick Start (Docker - Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vishwa-ud/to-do-task-web-app.git
   cd to-do-task-web-app
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the backend Spring Boot application
   - Build the frontend React application
   - Start MySQL database
   - Initialize the database with sample data
   - Start all services with health checks

3. **Access the application**
   - **Backend API:** http://localhost:8080/api
   - **PHP my Admin Database (tododb):** http://localhost:8081/
   - **Health Check:** http://localhost:8080/api/health

4. **Stop the application**
   ```bash
   docker-compose down
   ```

5. **Clean up (including database)**
   ```bash
   docker-compose down -v
   ```

### Quick Test (Docker - Recommended)

**Prerequisites:** Make sure containers are running (`docker-compose up -d`)

1. **Backend**

**Run all tests in Docker containers:**
  ```bash
  # Backend tests (build test container first)
  docker build -f backend/Dockerfile.test -t todo-backend-test backend
  docker run --rm todo-backend-test
  ```

2. **frontend**
**Run all tests in Docker containers:**

**Run tests in Docker (recommended):**
  ```bash
  docker-compose exec frontend npm test -- --run
  ```
2. **e2e**
  **Run Selenium automated e2e tests** (requires local Node.js)
  ```bash
  cd e2e
  npm install
  npm test
  ```
---

## 🎯 Features

- ✅ Create to-do tasks with title and description
- ✅ View the 5 most recent incomplete tasks
- ✅ Mark tasks as completed (removes them from view)
- ✅ Clean, modern, and responsive UI
- ✅ RESTful API design
- ✅ Comprehensive test coverage (unit, integration, E2E)
- ✅ Fully containerized with Docker
- ✅ Health checks for all services
- ✅ Production-ready architecture

## 🧱 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing

### Backend
- **Spring Boot 3.2** - Enterprise Java framework
- **Spring Data JPA** - Data access layer
- **Hibernate** - ORM framework
- **Maven** - Dependency management
- **JUnit 5** - Unit testing
- **Mockito** - Mocking framework
- **RestAssured** - API testing
- **JaCoCo** - Code coverage

### Database
- **MySQL 8.0** - Relational database

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Selenium WebDriver** - E2E testing
- **Mocha** - Test framework
- **Chai** - Assertion library

## 🏗️ System Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│   Browser   │───────▶│  Frontend    │───────▶│  Spring     │
│             │         │             │         │   Boot      │
└─────────────┘         └─────────────┘         │  (Backend)  │
                              │                 └──────┬──────┘
                              │                        │
                              │                        │
                              ▼                        ▼
                        ┌──────────┐           ┌─────────────┐
                        │  Static  │           │    MySQL    │
                        │  Assets  │           │  Database   │
                        └──────────┘           └─────────────┘
```


## 📁 Project Structure

```
to-do-task-web-app/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/todo/
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── exception/      # Exception handling
│   │   │   │   ├── model/          # JPA entities
│   │   │   │   ├── repository/     # Data repositories
│   │   │   │   ├── service/        # Business logic
│   │   │   │   └── TodoBackendApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                   # Unit & integration tests
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   ├── services/           # API services
│   │   │   └── api.js
│   │   ├── test/               # Component tests
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── vitest.config.js
│   └── tailwind.config.js
├── database/                   # Database scripts
│   └── init.sql
├── e2e/                        # End-to-end tests
│   ├── tests/
│   │   └── todo.test.js
│   └── package.json
├── docker-compose.yml
├── .gitignore
├── .dockerignore
└── README.md
```

## 🗄️ Database Design

### Task Table Schema

```sql
CREATE TABLE task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_completed (completed),
    INDEX idx_created_at (created_at)
);
```

**Columns:**
- `id` - Primary key, auto-incremented
- `title` - Task title (required, max 255 chars)
- `description` - Task description (optional, text)
- `completed` - Task completion status (default: false)
- `created_at` - Timestamp of task creation
- `updated_at` - Timestamp of last update

**Indexes:**
- `idx_completed` - Optimizes queries filtering by completion status
- `idx_created_at` - Optimizes sorting by creation date

## 🚀 Getting Started

### Prerequisites

- **Docker** - Version 20.10 or higher
- **Docker Compose** - Version 2.0 or higher
- **Git** - For cloning the repository

That's it! All other dependencies are containerized.

### Local Development Setup

#### Backend (Spring Boot)

**Prerequisites:**
- Java 17 
- Maven 3.9.11 # https://dlcdn.apache.org/maven/maven-3/3.9.11/binaries/apache-maven-3.9.11-bin.zip
- MySQL 8.0 running in docker

**Steps:**

1. **Configure database**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE tododb;
   CREATE USER 'todouser'@'localhost' IDENTIFIED BY 'todopassword';
   GRANT ALL PRIVILEGES ON tododb.* TO 'todouser'@'localhost';
   FLUSH PRIVILEGES;
   
   # Run init script
   mysql -u todouser -p tododb < database/init.sql
   ```

2. **Build and run backend**
   ```bash
   cd backend
   mvn clean install
   # run Only mysql in docker
   docker-compose up -d db 
   mvn spring-boot:run
   ```

3. **Run backend tests**
   ```bash
   cd backend
   
   # Run all tests
   mvn test
   
   # Run tests with coverage
   mvn clean test jacoco:report
   
   # View coverage report
   # Open: backend/target/site/jacoco/index.html
   ```

## 📡 API Documentation

### 💡 Tip: A ready-to-use Postman collection is available in the /postman folder. You can import it into Postman or the VS Code Postman extension to test all API endpoints easily.

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "UP",
  "service": "todo-backend"
}
```

#### Get Recent Tasks
```http
GET /api/tasks
```
**Description:** Returns the 5 most recent incomplete tasks

**Response:**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Buy books",
      "description": "Buy books for the next school year",
      "completed": false,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

#### Get Task by ID
```http
GET /api/tasks/{id}
```
**Parameters:**
- `id` (path) - Task ID

**Response:**
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "id": 1,
    "title": "Buy books",
    "description": "Buy books for the next school year",
    "completed": false,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json
```
**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 6,
    "title": "New Task",
    "description": "Task description",
    "completed": false,
    "createdAt": "2024-01-01T12:00:00",
    "updatedAt": "2024-01-01T12:00:00"
  }
}
```

#### Mark Task as Completed
```http
PUT /api/tasks/{id}/complete
```
**Parameters:**
- `id` (path) - Task ID

**Response:**
```json
{
  "success": true,
  "message": "Task marked as completed",
  "data": {
    "id": 1,
    "title": "Buy books",
    "description": "Buy books for the next school year",
    "completed": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T12:30:00"
  }
}
```

#### Delete Task
```http
DELETE /api/tasks/{id}
```
**Parameters:**
- `id` (path) - Task ID

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": null
}
```

### Error Responses

**400 Bad Request** - Validation error
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null
}
```

**404 Not Found** - Resource not found
```json
{
  "success": false,
  "message": "Task not found with id: 999",
  "data": null
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "An unexpected error occurred",
  "data": null
}
```

#### Frontend (React + Vite)

**Steps:**

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   Access at: http://localhost:5173


---

## 🧪 Testing

### Backend Testing

The backend includes comprehensive test coverage:

#### Unit Tests
- **Repository Tests** - Test data access layer
- **Service Tests** - Test business logic with mocked dependencies
- **Controller Tests** - Test REST endpoints with mocked services

#### Integration Tests
- **API Integration Tests** - Test complete API workflows with real database

**Run tests in Docker (recommended):**

**Prerequisites:** Make sure containers are running (`docker-compose up -d`)

```bash
# Build test container and run tests
docker build -f backend/Dockerfile.test -t todo-backend-test backend
docker run --rm todo-backend-test

# Generate coverage report (extract from container)
docker run --rm -v ${PWD}/backend:/output todo-backend-test sh -c "mvn test jacoco:report && cp -r target/site/jacoco /output/"
```

**Run tests locally (requires Maven + JDK 17):**

**Prerequisites:** Make sure Backend is running

```bash
   cd backend
   mvn clean install
   # run Only mysql in docker
   docker-compose up -d db 
   mvn spring-boot:run
   ```

```bash
cd backend
mvn test
mvn jacoco:report  # Generate coverage report
```
# Run tests individually,

```
# TaskControllerTest
mvn test -Dtest=TaskControllerTest
# TaskApiIntegrationTest
mvn test -Dtest=TaskApiIntegrationTest
# TaskRepositoryTest
mvn test -Dtest=TaskRepositoryTest
# TaskServiceTest
mvn test -Dtest=TaskServiceTest
```

**Coverage Goals:**
- Line Coverage: > 80%
- Branch Coverage: > 75%
- Class Coverage: > 90%

---

### Frontend Tests (Docker)

**Run tests in Docker (recommended):**
```bash
docker-compose exec frontend npm test -- --run
```

### Frontend Tests (Locally)

**Install dependencies:**
```bash
cd frontend
npm install
```

**Run tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm test -- --watch
```
---

### End-to-End Testing

E2E tests cover complete user workflows using Selenium WebDriver:

- Task creation
- Task completion
- Form validation
- Empty states
- Multi-task scenarios
- 5-task limit validation

**Run E2E tests:**

1. **Start the application** (if not already running)
   ```bash
   docker-compose up -d
   ```

2. **Run Selenium tests** (requires local Node.js)
   ```bash
   cd e2e
   npm install
   npm test
   ```

3. **Run in different browsers**
   ```bash
   # Chrome (default)
   npm run test:chrome
   
   # Firefox
   npm run test:firefox
   
   # Edge
   npm run test:edge
   
   # Headless mode
   npm run test:headless
   ```

**Note:** Selenium WebDriver automatically manages browser drivers. No manual driver installation required!


## 🎯 Test Cases

All 8 original tests:

1. ✅ Display application title
2. ✅ Create a new task
3. ✅ Show validation error when title is empty
4. ✅ Mark a task as completed
5. ✅ Display empty state when no tasks exist
6. ✅ Create multiple tasks and display them
7. ✅ Clear form after successful task creation
8. ✅ Respect the 5 task limit

## 📊 Expected Output

```
To-Do Task Application E2E Tests
    8 passing (10s)

✔ should display the application title
✔ should create a new task
✔ should show validation error when title is empty
✔ should mark a task as completed
✔ should display empty state when no tasks exist
✔ should create multiple tasks and display them
✔ should clear form after successful task creation
✔ should respect the 5 task limit

  8 passing (19s)
```

### Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose up --build backend
```

## 🚦 Health Checks

All services include health checks:

**Backend:**
```bash
curl http://localhost:8080/api/health
```

**Frontend:**
```bash
curl http://localhost:5173/
```

**Database:**
```bash
docker-compose exec db mysqladmin ping -h localhost -u root -prootpassword
```


## 🔧 Troubleshooting

### Port Conflicts

If ports are already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "8081:8080"  # Backend
  - "3307:3306"  # Database
  - "5173:5173"    # Frontend
```

### Build Failures

Clean Docker cache:
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```
---

## 🎨 UI Features

- **Gradient Background** - Modern purple gradient
- **Responsive Design** - Works on all screen sizes
- **Animations** - Smooth fade-in effects
- **Loading States** - Spinner during data fetch
- **Error Handling** - User-friendly error messages
- **Empty States** - Helpful messages when no tasks
- **Form Validation** - Client-side validation
- **Accessibility** - Proper labels and semantic HTML

## 📋 Design Principles

### SOLID Principles

✅ **Single Responsibility** - Each class has one reason to change
- Controllers handle HTTP requests
- Services contain business logic
- Repositories manage data access

✅ **Open/Closed** - Open for extension, closed for modification
- Use of interfaces and abstract classes
- Strategy pattern for extensibility

✅ **Liskov Substitution** - Subtypes are substitutable
- Proper use of inheritance
- Interface-based design

✅ **Interface Segregation** - Specific interfaces
- Focused repository interfaces
- DTOs for data transfer

✅ **Dependency Inversion** - Depend on abstractions
- Constructor injection
- Repository pattern

### Clean Code Principles

- **Meaningful Names** - Descriptive variable and method names
- **Small Functions** - Single-purpose methods
- **DRY** - Don't Repeat Yourself
- **Comments** - Where needed, code is self-documenting
- **Error Handling** - Proper exception handling
- **Formatting** - Consistent code style
- **Testing** - Comprehensive test coverage

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vishwa Udayanga**
- GitHub: [@Vishwa-ud](https://github.com/Vishwa-ud)

---

**Built with ❤️ using modern technologies and best practices**
build a small to-do task web application.
