# Team Task Manager 🚀

A full-stack project management application where users can create projects, assign tasks, and track progress with role-based access control.

## 🔗 Links
- **Live Application:** [Deploying to Railway soon...]
- **Demo Video:** [Link to your 2-5 min demo video]

## ✨ Key Features
- **Authentication & Authorization:** Secure JWT-based login and signup.
- **Role-Based Access Control (RBAC):** - `Admin`: Can create projects, add tasks, and assign members.
  - `Member`: Can view tasks and update task statuses.
- **Project Dashboard:** View projects and tracking metrics.
- **Task Management:** Real-time status updates (Pending, In Progress, Completed) and overdue task highlighting.
- **Modern UI:** Dark mode aesthetic with Glassmorphism elements.

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas), Mongoose
- **Security:** JWT, bcryptjs
- **Deployment:** Railway

## 🚀 Local Setup Instructions

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/yourusername/team-task-manager.git
   cd team-task-manager
   \`\`\`

2. **Install Dependencies:**
   \`\`\`bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   \`\`\`

3. **Environment Variables:**
   Create a `.env` file in the `backend` directory:
   \`\`\`env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   \`\`\`

4. **Run the Application:**
   Open two terminal windows.
   
   Terminal 1 (Backend):
   \`\`\`bash
   cd backend
   npm run dev
   \`\`\`

   Terminal 2 (Frontend):
   \`\`\`bash
   cd frontend
   npm run dev
   \`\`\`