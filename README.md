# LibraryBookFinder

**Frontend**
- React + Vite
- React Router
- Bootstrap 5

**Backend**
- Node.js + Express (REST API)
- JWT Authentication
- Mongoose (MongoDB ODM)

**Database**
- MongoDB Atlas (cloud)

**Deployment / DevOps**
- Vercel (Frontend + Serverless API)
- GitHub Actions (GitOps automated deployment)

---

Key Feature

- **Books**
  - Browse all books
  - Search by title/author
  - Filter by category
  - Filter “available only”
  - View book details

- **Authentication**
  - Register / Login
  - JWT-based protected routes

- **Favorites (Option B implementation)**
  - Favorite a book
  - View my favorites
  - Remove favorite

- **Reservations + Queue**
  - Reserve a book
  - If copies are available → reservation becomes **ACTIVE**
  - If no copies → reservation becomes **WAITING** with queue position
  - Cancel reservation and auto-promote next waiting user (MVP queue promotion)

- **Recommendations + Onboarding**
  - First-time users select interested categories (one-time onboarding)
  - Recommendations page shows books matching selected categories

- **Book Cover Images**
  - Cover images stored locally and referenced by each book using `coverUrl`


Local Development:

npm install
npm i express cors dotenv mongoose
npm i -D nodemon concurrently
npm i bcryptjs jsonwebtoken
npm i react-router-dom bootstrap
npm i bootstrap
npm run dev

Auth:

POST /api/auth/registe
POST /api/auth/login
Books / Categories
GET /api/books
GET /api/books/:id
GET /api/categories
Favorites (protected)
GET /api/favorites
POST /api/favorites
DELETE /api/favorites/:id
Reservations (protected)
GET /api/reservations
POST /api/reservations
PATCH /api/reservations/:id/cancel

Deployment Architecture (Vercel + MongoDB Atlas)

User visits the Vercel URL → React static site loads.
React calls backend using relative API routes like /api/....
Vercel routes /api/* to a Serverless Function (api/index.js).
The serverless backend connects to MongoDB Atlas using MONGO_URI.
Data is read/written in Atlas and returned to the frontend UI.

Components

Frontend (React build): hosted on Vercel (dist/)

Backend (Express): hosted as Vercel Serverless Function (api/index.js)

Database: MongoDB Atlas (cloud)

GitOps / CI-CD (Automated Deployment)

This project uses GitHub Actions to automatically deploy to Vercel on every push to main.

GitOps workflow

Developer pushes commits to main on GitHub
GitHub Actions runs the workflow: Deploy (Vercel)
The workflow builds and deploys the latest version to Vercel
Updated site becomes available online
Proof of automation
You can view runs in: GitHub repo → Actions tab → Deploy (Vercel)

Vercel Setup Notes
Required Vercel Environment Variables

Set these in Vercel project settings:

MONGO_URI
JWT_SECRET
MongoDB Atlas Network Access

To allow Vercel servers to access the database:

Atlas → Network Access → allow 0.0.0.0/0 (for demo/project)




How to Trigger a Redeploy (GitOps Demo)

Make any change, then:

git add .
git commit -m "Demo: trigger deploy"
git push