# WellnessZ Client Management System

## Overview
The WellnessZ Client Management System is a REST API for managing clients and coaches with advanced features such as role-based access, scheduling, notifications, and analytics. Built with **Node.js**, **Express**, and **MongoDB**, it includes JWT-based authentication and role-based access control.

## Project Setup
1. **Clone the Repository**:
   ```bash
   git clone <your-github-repo-url>
   cd WellnessZ-Client-Management-System

2. Install Dependencies:
   npm install

3. Set Up Environment Variables: Create a .env file in the root directory with:
   PORT=3000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   EMAIL_USER=<your-email-address>
   EMAIL_PASS=<your-email-password>

4. Start the Server:
   npm start 

# API Documentation

## Authentication
## Login: POST /api/auth/login
   Required Fields: email, password
   Returns a JWT token on success.

## Coach and Client Management
## Create Coach (Admin only): POST /api/coaches
   Fields: name, email, password, specialization

## Create Client (Admin/Coach): POST /api/clients
   Fields: name, email, phone, age, goal, coachId

## Get Clients by Coach (Admin/Coach): GET /api/coaches/:coachId/clients

## Update Client Progress (Coach only): PATCH /api/clients/:id/progress
   Fields: progressNotes, lastUpdated, weight, bmi

## Delete Client (Admin only): DELETE /api/clients/:id

## Scheduling and Notifications
## Schedule Session: POST /api/clients/:id/schedule
   Fields: date, time, sessionType
   Sends an email notification to the client.

## Analytics and Dashboard (Admin only)
## Dashboard Metrics: GET /api/admin/dashboard
   Includes: Total clients, active clients, total coaches, average clients per coach, and clients' progress trends.

## Role-Based Access Control
   Admin: Has access to manage all coaches and clients.
   Coach: Can manage only their own clients.
   Implemented in auth.js middleware using JWT-based authentication and role checking.

## Testing the API
1. Use Thunder Client or Postman for testing endpoints.
2. Include the Authorization header with the token obtained from the login endpoint in requests to protected routes.


#  Role-Based Access Documentation

## Overview
   Role-based access control (RBAC) is implemented to restrict route access based on user roles (Admin or Coach).

## Implementation

## 1. JWT Authentication: Tokens include the user ID and role.
## 2. Auth Middleware (auth.js):
Decodes the JWT token and attaches the user info to the request.
Checks if the user’s role matches the required role(s) for the route.

## 3.Role Permissions:
Admin: Can create, delete, and manage all resources.
Coach: Can only manage resources assigned to them (i.e., their own clients).

# Example Usage in Routes
  Example route for creating a client, accessible only by coaches and admins:

  ## router.post("/clients", auth(["admin", "coach"]), clientController.createClient);
