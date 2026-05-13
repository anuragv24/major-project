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
# 🛠️ Software & Tools Requirements
* Runtime Environment: Node.js (v18.0.0 or higher).  
* Database: MongoDB Atlas account.  
* Package Manager: npm (v9.0.0+).  
* Browser: Chrome, Firefox, or Edge (Modern versions).
* Development Tools: VS Code, Postman (for API testing).
* External Services:
  * Sarvam AI: For translation services.  
  * Cloudinary: For image storage.  
  * Brevo (Sendinblue): For SMTP/Email OTP services

---
# 🗄️ Database Setup Instructions
The project uses MongoDB Atlas for a scalable, cloud-based NoSQL database.  
1. Create a Cluster: Log in to MongoDB Atlas and create a new cluster.  
2. Database User: Create a user with Read/Write permissions.  
3. Network Access: Set the IP Access List to 0.0.0.0/0 (Allow access from anywhere).  
4. Connection String: Copy the URI (looks like mongodb+srv://<username>:<password>@cluster0...).  
5. Initialization: The application uses Mongoose; schemas will be automatically generated upon the first successful connection.

[Video: Step-by-Step MongoDB Atlas Setup](https://youtu.be/jmGgTPr8Kyw?si=YRpf6ubapWHTff2g)

---

# 🖼️ Cloudinary Setup (Media Management)
Cloudinary handles your chat images and profile pictures.
1. Create Account: Sign up at Cloudinary.
2. Access Dashboard: Go to your Console Dashboard to find your Cloud Name, API Key, and API Secret.
3. Backend Integration: These keys allow the messageController to upload images via the cloudinary npm package before saving the URL to MongoDB.
4. Update .env: Add these values to your backend environment file.

[Video: Step-by-Step Cloudinay Setup](https://youtu.be/6kks8K9r4CE?si=IrbYZsKAav9C3fum)

---

# 📧 Brevo Setup (Email & OTP Service)
Brevo provides the SMTP relay required to send 6-digit verification codes to new users.
1. Create Account: Sign up at Brevo.com.
2. Generate SMTP Key: Navigate to SMTP & API under your account settings and generate a new Master Password/Key.
3. Verified Sender: Ensure the email address you use in EMAIL_FROM is verified in the Senders & IPs section of Brevo.
4. Configuration: Use smtp-relay.brevo.com as your host and port 587 for secure delivery.

[Video: Step-by-Step Cloudinay Setup](https://youtu.be/-zMT0fQj4UQ?si=SNcOKRiQEp2Z-0HE)


---

# 🚀 How to Run the Project
## A. Environment Configuration
Create a `.env` file in the root ~/backend~ directory and populate it with specific keys:
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

Create a `.env` file in the root ~/frontend~ directory:
```
VITE_BACKEND_URL='http://localhost:5000'
```

## B. Backend Execution
1. Open a terminal in the root folder.
2. Navigate to the backend: `cd backend`.
3. Install dependencies: `npm install`.
4. Start the server: `npm run server`.

## C. Frontend Execution
1. Open a second terminal window.
2. Navigate to the frontend: `cd frontend`.
3. Install dependencies: `npm install`.
4. Launch the application: `npm run dev`.
5. Access the app at: `http://localhost:5173`.

---

# ⚙️ Project Execution Steps
1. Registration: New users sign up with their details. The backend triggers a Brevo SMTP call to send a 6-digit OTP to the user's email.
2. Verification: The user enters the OTP. Once verified, the account is activated in the MongoDB database.
3. Language Setup: Upon login, the user is navigated to the Profile Page to select their native/preferred language.
4. Socket Connection: The system automatically establishes a Socket.io connection, mapping the userId to the current socketId for real-time delivery.
5. Multilingual Messaging:
   * Sender sends a message in Hindi.
   * Backend logic checks the Receiver’s preferred language (e.g., English).
   * If they differ, Sarvam AI translates the text before it is saved to the database.
6. Real-time Delivery: The message (original + translated) is emitted via WebSockets to the receiver's screen instantly.

# Repository Structure

```
├── backend/           # Node.js & Express source code
│   ├── controllers/   # Business logic (Auth, Messages)
│   ├── lib/           # Database & Utility connections
│   ├── routes/        # API Endpoints
│   └── server.js      # Main Entry point
├── frontend/          # React & Vite source code
│   ├── src/           # Components, Context, Pages
│   └── App.jsx        # Routing logic
└── README.md          # Project documentation
```


