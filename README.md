# 🎓 EduConnect — Coaching Academy Management System

## 1. Overview

**EduConnect** is a full-stack web application developed to manage a coaching academy's digital operations.  
It allows teachers, students, and parents to interact through a secure and user-friendly interface for managing courses, instructors, and attendance records.

This project demonstrates core concepts of **web application development**, **authentication systems**, and **database management**, integrating both frontend and backend technologies cohesively.

---

## 2. Objectives

- To design a functional web-based platform for academic institutions.  
- To implement secure authentication and role-based access control.  
- To enable teachers to manage courses, instructors, and attendance.  
- To allow students and parents to view relevant data through a clean, responsive interface.

---

## 3. Technology Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla JS) |
| **Backend** | Node.js with Express framework |
| **Database** | SQLite (file-based relational database) |
| **Authentication** | JSON Web Tokens (JWT) |

---

## 4. System Architecture

EduConnect follows a **client–server architecture**:
- The **frontend** (client) sends requests to the backend via RESTful APIs.  
- The **backend** (server) validates requests, interacts with the SQLite database, and returns JSON responses.  
- JWT-based authentication ensures secure, role-controlled access to resources.

---

## 5. Functional Features

### 🔐 Authentication and Authorization
- Secure JWT login and registration.
- Role-based access control (Teacher / Student / Parent).
- Session persistence using browser `localStorage`.

### 📘 Course Management
- Teachers can add, update, or delete courses.
- All users can view available courses.

### 🧑‍🏫 Instructor Management
- Teachers can add, update, or remove instructor information.
- All users can view instructors and their subjects.

### 📅 Attendance Management
- Teachers can record attendance for students.
- Attendance data is visible to all users.

### 🏠 Frontend Interface
- Responsive navigation bar for easy access.
- Slideshow with images and indicators for a professional appearance.
- Informational sections including academy overview, testimonials, and student statistics.

---

## 6. Project Structure

EduConnect/
├── backend/
│ ├── routes/
│ │ ├── auth.js
│ │ ├── courses.js
│ │ ├── instructors.js
│ │ └── attendance.js
│ ├── database.js
│ ├── server.js
│ └── models/
│ └── schema.sql
│
├── frontend/
│ ├── index.html
│ ├── courses.html
│ ├── instructors.html
│ ├── attendance.html
│ ├── login.html
│ ├── style.css
│ ├── auth.js
│ ├── app.js
│ ├── script.js
│ └── images/
│ ├── 1.png
│ ├── 2.png
│ └── 3.png
│
└── README.md

---

## 7. Database Schema

### **Users Table**
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Full name |
| email | TEXT | Login email |
| password | TEXT | Encrypted password |
| role | TEXT | Role: 'teacher', 'student', 'parent' |

### **Courses Table**
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| subject | TEXT | Course name |
| schedule | TEXT | Schedule details |

### **Instructors Table**
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Instructor name |
| subject | TEXT | Subject taught |
| bio | TEXT | Short biography |

### **Attendance Table**
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key → users.id |
| course_id | INTEGER | Foreign key → courses.id |
| date | TEXT | Date of attendance |
| status | TEXT | ‘Present’ or ‘Absent’ |

---