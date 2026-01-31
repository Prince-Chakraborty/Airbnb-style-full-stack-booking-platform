# 🏠 Airbnb-Style Full Stack Booking Platform

A full-stack web application that allows users to create, view, edit, and manage property listings with secure authentication and authorization.  

This project focuses on **real-world backend concepts** such as session management, access control, and data validation instead of being a simple CRUD tutorial.

---

## 🚀 Features
- **User Authentication:** Sign up, login, and logout using Passport.js  
- **Session Management:** Persistent sessions with flash messages  
- **Listings Management:** Create, edit, and delete listings  
- **Owner-Only Permissions:** Only listing owners can update or delete listings  
- **Image Upload:** Upload images using Multer + Cloudinary  
- **Reviews:** Add and delete reviews with author-level permissions  
- **Server-Side Validation:** Ensure proper input using Joi  
- **Flash Messages:** Real-time feedback for user actions  

---

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** Passport.js (Local Strategy)  
- **Templating:** EJS  
- **File Upload:** Multer + Cloudinary  
- **Validation:** Joi  

---

## 🔐 Authorization Logic
- Only authenticated users can create listings  
- Only listing owners can edit or delete their listings  
- Reviews can only be deleted by their author  

---

## ⚠ Known Limitations
- Login redirect may reset due to Passport session regeneration  
- **Planned improvement:** Persistent redirect handling using session store  

---

## 📌 Future Enhancements
- Persistent redirect after login  
- Search and filtering for listings  
- Pagination for large datasets  
- Wishlist / favorite listings  
- Admin moderation panel  

---

## 🧠 What I Learned
- Middleware-based access control  
- Secure session handling and authentication  
- MVC architecture in Express.js  
- Real-world error handling and input validation  
- Designing backend logic beyond tutorials  

---

## ▶ How to Run Locally
1. Clone the repository:
```bash
git clone https://github.com/Prince-Chakraborty/Airbnb-style-full-stack-booking-platform.git
