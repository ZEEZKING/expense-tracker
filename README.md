# 💸 Expense Tracker Frontend

A **Personal Expense Tracker Web Application** built with **Angular 17**, providing users with a secure, responsive, and interactive interface to manage expenses, filter by date or category, and visualize spending trends with charts.  

Developed as part of the **CrediSure Full Stack Engineer Technical Assessment**, this frontend integrates seamlessly with the [Expense Tracker API](https://expensetrackerapi-bdbkged4hzgvbqgk.westeurope-01.azurewebsites.net/swagger/index.html) built with ASP.NET Core 8.

---

## 🌍 Live Project Links

- **Frontend (Vercel):** [https://expense-tracker-nu-fawn.vercel.app](https://expense-tracker-nu-fawn.vercel.app)  
- **Backend (Swagger):** [https://expensetrackerapi-bdbkged4hzgvbqgk.westeurope-01.azurewebsites.net/swagger/index.html](https://expensetrackerapi-bdbkged4hzgvbqgk.westeurope-01.azurewebsites.net/swagger/index.html)

---

## 🧩 Features

✅ User Registration & Login (JWT Authentication)  
✅ Add, Edit, Delete, and View Expenses  
✅ Filter Expenses by Category or Date  
✅ View Spending Summary by Category  
✅ Visualize Spending Trends using Chart.js  
✅ Toast Notifications for Success/Error  
✅ Secure Requests via Interceptors  
✅ Protected Routes via Guards  
✅ Responsive Layout using TailwindCSS  

---

## 🏗️ Project Architecture

The frontend project is structured using a **modular, scalable pattern**, separating UI components, services, guards, and interceptors for maintainability and scalability.

---

**Folder Responsibilities:**

| Folder/File | Purpose |
|--------------|----------|
| **components/** | Reusable UI components such as forms, modals, and charts |
| **guards/** | Protects private routes and ensures authentication |
| **interceptors/** | Injects JWT tokens into requests and handles HTTP errors |
| **models/** | TypeScript interfaces for type safety |
| **services/** | Handles API communication (Auth, Expense CRUD) |
| **app.routes.ts** | Defines application routes |
| **app.config.ts** | App-wide configuration and settings |
| **styles.css** | Global TailwindCSS styling and theme setup |

---

## ⚙️ Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | Angular 17 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Chart.js |
| HTTP | Angular HttpClient + RxJS |
| Authentication | JWT via Interceptors & Guards |
| Deployment | Vercel |
| API | ASP.NET Core 8 (Hosted on Azure) |

---

## 🧠 Core Modules Overview

| Module | Description |
|--------|--------------|
| **Auth** | Handles registration and login with JWT token storage |
| **Guards** | Protects dashboard and expense routes from unauthorized access |
| **Interceptors** | Attaches JWT to all outgoing requests, handles 401/403 errors |
| **Services** | Manages API calls and state (AuthService, ExpenseService) |
| **Components** | Contains UI logic and data binding for expense forms, lists, and charts |

---

## 🔗 API Integration

**Base URL:**  
`https://expensetrackerapi-bdbkged4hzgvbqgk.westeurope-01.azurewebsites.net`

| HTTP | Endpoint | Description |
|------|-----------|-------------|
| **POST** | `/api/Auth/register` | Register a new user |
| **POST** | `/api/Auth/login` | Authenticate and receive JWT token |
| **GET** | `/api/Expense/all` | Retrieve all user expenses |
| **POST** | `/api/Expense` | Add a new expense |
| **PUT** | `/api/Expense/{id}` | Update an existing expense |
| **DELETE** | `/api/Expense/{id}` | Delete an expense |
| **POST** | `/api/Expense/filter` | Filter expenses by date or category |
| **GET** | `/api/Expense/trend` | Get data for expense trend charts |
| **GET** | `/api/Expense/summary/category` | Get total spending grouped by category |

---

## 🧰 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ZEEZKING/expense-tracker.git
cd expense-tracker
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Open the environment file at `src/environments/environment.ts` and add or update the following configuration:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://expensetrackerapi-bdbkged4hzgvbqgk.westeurope-01.azurewebsites.net'
};
```

### 4️⃣ Run the Application
```bash
ng serve
```

The application will be available at `http://localhost:4200`

---
