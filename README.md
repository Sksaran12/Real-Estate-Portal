# EstateHub - Production MERN Real Estate Portal

A production-grade, trustworthy, and modern Real Estate Web Application built using Node.js, Express, MongoDB, and React. Localized for Guwahati, Assam, and India.

---

## 🌟 Core Features

- **Property Listings & Search**: Grid view with high-res image galleries, BHK/Bath/SqFt stats, INR (`₹`) price badges, and exact Guwahati street address details.
- **Instant Filtering**: Real-time filtering by city, price range, property type (Sale/Rent), category (Apartment, House, Villa, Commercial, Studio), bedrooms, and sorting without page reloads.
- **Role-Based Access Control**:
  - **Buyer/User**: Save favorites, send direct inquiries to owners, use AI assistant.
  - **Property Owner**: Post new listings, use AI description generator, view received inquiries, manage listings.
  - **Admin**: Dashboard stats analytics, approve/reject property submissions, manage user roles, global inquiry monitor.
- **Direct Owner Inquiries**: Logged-in buyers can send inquiries directly to listing owners with 0% brokerage.
- **Indian EMI Loan Calculator**: Interactive home loan estimator with live monthly breakdown.
- **AI Integration**:
  - 🤖 **EstateAI Assistant**: Natural language property finder chat widget.
  - ✨ **AI Description Generator**: Auto-generates high-converting listing copy from basic property specs.

---

## 🚀 Quick Start Guide

### 1. Backend Setup (`/backend`)

```bash
cd backend
npm install
npm run seed  # Seeds initial property database
npm start     # Starts server on http://localhost:5000
```

### 2. Frontend Setup (`/frontend`)

```bash
cd frontend
npm install
npm run dev   # Starts Vite dev server on http://localhost:5173
```

---

## 🔒 Security & Administrator Setup

User accounts are authenticated with 256-bit JWT tokens and bcrypt password hashing.

To create or update an Administrator account with custom credentials, run this command in `/backend`:

```bash
node utils/createAdmin.js admin@estatehub.com yoursecretpassword "Admin Name"
```

---

## 📂 Project Structure

```
real-estate-portal/
├── backend/
│   ├── config/ (DB & Cloudinary config)
│   ├── controllers/ (Auth, Property, Inquiry, Favorite, Admin, AI)
│   ├── middleware/ (Auth, Error, Upload, Validate)
│   ├── models/ (User, Property, Inquiry, Favorite)
│   ├── routes/ (Express API endpoints)
│   ├── utils/ (Seed & Admin scripts)
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/ (Common, Properties, Admin, AI)
    │   ├── context/ (AuthContext, FavoriteContext)
    │   ├── pages/ (Home, Search, Detail, AddProperty, UserDashboard, AdminDashboard, Login, Register)
    │   └── services/ (Axios API instance)
    ├── index.html
    └── package.json
```
