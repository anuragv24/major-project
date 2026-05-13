# Sangam 🌐
### A Full-Stack AI-Powered Multilingual Chat Ecosystem
`Sangam` is a sophisticated real-time communication platform designed to bridge global linguistic gaps. By integrating high-performance `Socket.io` with `Sarvam AI`, the application enables seamless cross-language dialogue where users send messages in their native tongue and receivers view them in their preferred language instantly.

[View App Live](https://sangam-ashen.vercel.app/)  
[Github Repo](https://github.com/anuragv24/major-project) 

---

# 🚀 Key Features
* **Real-time Bi-directional Communication:** Low-latency messaging powered by Socket.io.
* **Neural Machine Translation:** Dynamic translation engine using Sarvam AI for high-fidelity language conversion.
* **Secure Auth & Identity:** JWT-based session management with multi-stage OTP verification via Brevo.
* **Presence Tracking:** Real-time monitoring of user online/offline status via a dynamic userSocketMap.
* **Media Management:** Full-stack integration with Cloudinary for secure image hosting and delivery.
* **Interactivity:** Integrated React Joyride for interactive user onboarding and walkthroughs.
* **Safety Controls:** Built-in user blocking and unblocking capabilities to ensure a secure environment.

---

# 🛠️ Technical Deep Dive
## Frontend Architecture
* Core: React 19 and Vite for optimized build performance.  
* Styling: Tailwind CSS 4 for a modern, responsive "dark-mode" aesthetic.  
* Routing: React Router Dom 7 handling protected and public navigation paths.
* UX/UI: Lucide React for iconography and React Hot Toast for real-time feedback.  
* Networking: Axios with interceptors for streamlined API communication. 

## Backend Infrastructure
* Server: Express 5 built on Node.js.  
* Database: MongoDB utilizing Mongoose for schema-based data modeling. 
* Security: BcryptJS for password hashing and JWT for secure token-based access.  
* Communication: Native Node.js HTTP server wrapper for Socket.io integration.
* Automation: Nodemailer integrated with Brevo for automated transactional emails.  

---

# 📦 Project Structure & Installation
## Environment Configuration
Create a .env file in the root backend directory:
```
MONGODB_URI=your_mongodb_uri

PORT=5000

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SARVAM_API_KEY=your_sarvam_key

EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=YOUR_BREVO_EMAIL
EMAIL_PASS=BREVO_EMAIL_PASS
EMAIL_FROM=YOUR_EMAIL

FRONTEND_URL=http://localhost:5173
```

Create a .env file in the root frontend directory:
```
VITE_BACKEND_URL='http://localhost:5000'
```

## Installation
```
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd frontend
npm install
```

## Developement
```
# Start Backend (Nodemon)
npm run server

# Start Frontend (Vite)
npm run dev
```
