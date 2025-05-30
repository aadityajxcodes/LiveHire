# LiveHire

LiveHire is a platform where companies can hire experienced interviewers to conduct technical interviews for job candidates.

## Features

- Separate login for companies & interviewers
- A dashboard for both roles to manage interviews
- A coding editor for live coding rounds
- A video calling interface for live interviews
- Report generation system for interview evaluations

## Tech Stack

- **Frontend**: React, Socket.io Client, Monaco Editor
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB
- **Authentication**: JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/livehire.git
   cd livehire
   ```

2. Install dependencies:
   ```
   npm run install
   ```

3. Environment Variables:
   - Create a `.env` file in the backend directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/livehire
   JWT_SECRET=your-secret-key-here
   ```

4. Seed the database with demo data:
   ```
   npm run seed
   ```

## Usage

Start the development server:
```
npm start
```

This will start both the backend server and the frontend application.

- Backend will run on: http://localhost:5000
- Frontend will run on: http://localhost:3000

## Demo Accounts

### Companies:
- Email: techcorp@example.com, Password: password123
- Email: datadrive@example.com, Password: password123
- Email: webwizards@example.com, Password: password123

### Interviewers:
- Email: john.doe@example.com, Password: password123
- Email: jane.smith@example.com, Password: password123
- Email: michael.johnson@example.com, Password: password123

## Project Structure

```
livehire/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   ├── seedData.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
``` 
