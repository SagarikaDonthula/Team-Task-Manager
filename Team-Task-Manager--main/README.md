# Full-Stack Team Task Manager

A MERN stack application for managing projects and tasks with role-based access control (Admin/Member).

## Features
- **Authentication**: JWT-based user signup and login.
- **Roles**: Admin and Member access levels.
- **Dashboard**: Overview of tasks (total, completed, pending, overdue).
- **Projects**: Admins can create projects and view all projects.
- **Tasks**: Admins can assign tasks. Members can update their assigned task statuses.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth.

## Setup Instructions

### 1. Clone & Install
```bash
git clone <repo-url>
cd team-task-manager

# Backend
cd backend
npm install
# Create .env file based on .env.example
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
```

### 2. Environment Variables

**Backend (`backend/.env`)**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**Frontend (`frontend/src/services/api.js`)**
Update the `baseURL` to point to your backend API URL in production.

## Deployment Steps

### Backend (Railway)
1. Push your code to GitHub.
2. Go to Railway and create a new project from your repo.
3. Select the `backend` folder as the root directory (or use `railway.json`).
4. Set the Environment Variables (`MONGO_URI`, `JWT_SECRET`, `PORT`).
5. Railway will automatically build and deploy the Express server.

### Frontend (Vercel)
1. Go to Vercel and import your GitHub repository.
2. Select the `frontend` folder as the Root Directory.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy.

> **Note:** The frontend includes a `vercel.json` file to handle React Router rewrites automatically.
