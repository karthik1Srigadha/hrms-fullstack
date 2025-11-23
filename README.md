📌 HRMS Full-Stack Application

A full-stack Human Resource Management System (HRMS) built with:

React.js (Frontend)

Node.js + Express.js (Backend)

PostgreSQL + Sequelize ORM (Database)

JWT Authentication (Login & Protected Routes)

Render (Backend Deployment)

Vercel (Frontend Deployment)

This system allows you to manage Employees, Teams, and Assignments, with a fully responsive UI that works on mobile, tablet, and desktop.

🚀 Live Demo

🔗 Frontend (Vercel):
https://hrms-fullstack.vercel.app/


📂 Project Structure
hrms-fullstack/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   └── index.js
│   ├── config/config.json
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── services/
    │   ├── Styles/
    │   └── App.js
    ├── package.json
    └── .env

✨ Features
🔐 User Authentication

Secure Login using JWT

Protected routes for employees and teams

Auto token handling with Axios interceptors

👨‍💼 Employee Management

Add employee

Edit employee

Delete employee

View employee team assignments

Fully responsive (table → cards on mobile)

👥 Team Management

Create teams

Edit teams

Delete teams

Assign multiple employees

View team member count

Modal-based assignment system

📱 Mobile Responsive

Tables turn into clean card layout

Buttons resize

Forms stack vertically

Dark theme supported

Works smoothly on phones & tablets

☁ Deployment

Frontend → Vercel

Backend → Render

Database → Render PostgreSQL

Sequelize ORM with SSL support for cloud environments

🛠️ Tech Stack
Frontend

React.js

React Router

Axios

CSS3 (Responsive + Dark Mode)

Backend

Node.js

Express.js

Sequelize ORM

PostgreSQL

JWT Authentication

Deployment

Render (Backend + Database)

Vercel (Frontend)

⚙️ Installation & Setup
1️⃣ Clone the project
git clone https://github.com/karthik1Srigadha/hrms-fullstack
cd hrms-fullstack

2️⃣ Backend Setup
cd backend
npm install

Create .env in backend:
PORT=5000
NODE_ENV=development

JWT_SECRET=your-secret

DATABASE_URL=postgresql://username:password@host:5432/dbname

Run backend:
npm start

3️⃣ Frontend Setup
cd ../frontend
npm install


Create .env:

REACT_APP_API_URL=https://your-backend-url.onrender.com


Run frontend:

npm start

🔗 API Endpoints
Auth
Method	Endpoint	Description
POST	/auth/register	Register user
POST	/auth/login	Login user
Employees
Method	Endpoint	Description
GET	/employees	Get all employees
POST	/employees	Create employee
PUT	/employees/:id	Update employee
DELETE	/employees/:id	Delete employee
Teams
Method	Endpoint	Description
GET	/teams	Get all teams
POST	/teams	Create team
PUT	/teams/:id	Update team
DELETE	/teams/:id	Delete team
POST	/teams/:id/assign	Assign employees
📱 Responsive UI

Desktop → full table layout

Mobile → card layout

Smooth animation for modals

Dark mode automatically supported

Professional HRMS-style UI

🐞 Common Issues
❌ Backend can't connect to DB on Render

✔ Use DATABASE_URL
✔ Enable SSL in Sequelize:

dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
}

❌ Frontend cannot access backend

✔ Add correct API URL in .env
✔ Enable CORS in backend

📸 Demo Video

🎞 Screen Recording (Google Drive):
https://drive.google.com/file/d/1lMS3UqPPulxAIjBsQZRavqz_GPO7sIlH/view?usp=sharing

🙌 Acknowledgements

Thanks to the assignment team for providing this project.
This HRMS system helped practice:

Full-stack development

API design

Database modeling

Authentication

Deployment

Responsive UI

📝 License

This project is under the MIT License.
