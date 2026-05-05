# Full-Stack Team Task Manager

A complete full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) designed for teams to manage projects and tasks efficiently. It features role-based access control where Admins can create projects and assign tasks, and Members can view and update their task statuses.

## Features

- **Authentication System:** Secure JWT-based registration and login.
- **Role-Based Access Control (RBAC):**
  - **Admin:** Can create projects, view all tasks, assign tasks to members, and manage the workspace.
  - **Member:** Can view their assigned tasks and update the task status (Todo, In Progress, Done).
- **Interactive Dashboard:** View total, completed, pending, and overdue tasks at a glance.
- **Clean UI:** Responsive and modern interface built with React, Vite, and Tailwind CSS.
- **RESTful API:** Robust Node.js and Express backend using Mongoose for MongoDB.

## Tech Stack

- **Frontend:** React, Vite, React Router DOM, Axios, Tailwind CSS, Lucide React
- **Backend:** Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), bcryptjs
- **Deployment:** Ready for deployment on Railway (Backend) and Vercel/Netlify (Frontend).

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB connection string (Atlas or Local)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
# (Assuming you have it locally)

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend/` folder and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Running Locally

You can run both the frontend and backend concurrently.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173` and the API at `http://localhost:5000`.

## Deployment Steps

### Backend Deployment (Railway)

1. Create a GitHub repository and push your code.
2. Go to [Railway.app](https://railway.app/) and create a new project from your GitHub repo.
3. Select the `backend` folder as the root directory if Railway prompts you.
4. Go to **Variables** in your Railway dashboard and add:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (Railway usually handles this automatically, but you can set it)
5. Railway will automatically build and deploy your Node.js application.
6. Copy the generated API URL (e.g., `https://your-app.up.railway.app`).

### Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com/) and import your GitHub repository.
2. Ensure the **Framework Preset** is set to `Vite`.
3. Set the **Root Directory** to `frontend`.
4. In the **Environment Variables** section, add your production API URL:
   - `VITE_API_URL` = `https://your-app.up.railway.app/api`
5. Click **Deploy**. Vercel will build and host your frontend application.

## Bonus: Demo Video Recording Guide

If you need to record a demo video (2-5 minutes):
1. **Introduction (30s):** Briefly introduce the Team Task Manager and its purpose.
2. **Registration/Login (30s):** Show a user signing up and selecting the Admin role.
3. **Admin Flow (1m):**
   - Go to Projects and create a new project.
   - Go to Tasks and assign a new task to another user.
4. **Member Flow (1m):**
   - Log out and log in as the assigned Member.
   - Show the member's dashboard.
   - Change the assigned task's status to "In Progress" or "Done".
5. **Dashboard & Conclusion (30s):** Show how the dashboard updates dynamically and wrap up.

---
*Built with ❤️ using the MERN Stack.*
