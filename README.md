# Flowbit AI
This repository contains the full-stack solution for the Flowbit technical challenge. The project demonstrates a multi-tenant, micro-frontend architecture featuring a React shell, a secure Node.js API, and integration with an n8n workflow engine, all containerized with Docker.




Submitted by: Gaurav Arya

Email: gauravarya272003@gmail.com

Submission Date: 17/7/2025

Demo Video
[link]
(A short video demonstrating the complete, end-to-end functionality.)

Quick Start 
This project is fully containerized. The only prerequisite is to have Docker and Docker Compose installed on your machine.

1. Clone the Repository:
  git clone https://github.com/gauravaryaarya/flowbit-challenge.git
  cd flowbit-challenge

2. Create Environment File:
  Create a .env file in the root of the project by copying the example. This file contains all the necessary environment variables.

  cp .env.example .env
  (Note: The .env file is pre-configured with secure defaults and shared secrets, so no changes are needed to run the project.)

3. Build and Run with Docker Compose:
  This single command will build the images for all services, start the containers, run the database seed script, and configure the webhook tunnel.
  docker-compose up --build
  The system will be fully operational after a minute or two.

4. Access the Application:
  React Shell UI: http://localhost:3000
  n8n Workflow Engine UI: http://localhost:5678

Seed Data & Tenant Credentials
  The database is automatically seeded with two tenants and one Admin user for each.

Tenant
  1. LogisticsCo
    Email : admin@logisticsco.com
    Password : Password123!

  2. RetailGmbH
    Email : admin@retailgmbh.com
    Password : Password123!

Architecture Diagram
<img width="3840" height="2955" alt="Untitled diagram _ Mermaid Chart-2025-07-16-213032" src="https://github.com/user-attachments/assets/29d0e8ac-5ec1-4f73-a39b-e4bc62d2562f" />


Core Requirements Checklist
  R1: Auth & RBAC: Implemented using email/password (bcrypt) and JWTs. Middleware protects routes and validates roles.
  
  R2: Tenant Data Isolation: All Mongoose schemas include a customerId field. API logic ensures users can only access data belonging to their own tenant. A Jest test (packages/api/src/tests/isolation.test.js) proves this.
  
  R3: Use-Case Registry: A registry.json file maps tenants to their accessible micro-frontends. The /api/me/screens endpoint delivers this based on the user's JWT.
  
  R4: Dynamic Navigation: The React shell fetches screens from the API and dynamically renders the sidebar. Webpack Module Federation is used to lazy-load the SupportTicketsApp.
  
  R5: Workflow Ping: The /api/tickets endpoint triggers an n8n workflow. The workflow calls back to /webhook/ticket-done using a shared secret, which is verified by the API. The UI is updated via WebSockets.
  
  R6: Containerised Dev: docker-compose.yml orchestrates all services (API, Shell, MFE, MongoDB, n8n) for a one-command setup.

Bonus Features 
  Audit Log: A basic audit log collection in MongoDB tracks key events (TICKET_CREATED, TICKET_STATUS_UPDATED).
  
  Cypress Smoke Test: An end-to-end test logs in, creates a ticket, and asserts the status update.
  
  GitHub Actions CI: A workflow (/.github/workflows/ci.yml) is configured to run linting and Jest unit tests on every push to the main branch.

Technology Stack
  Backend: Node.js, Express.js
  Frontend: React 18, Webpack 5 (Module Federation)
  Database: MongoDB (with Mongoose)
  Authentication: JSON Web Tokens (JWT), bcrypt
  Workflow Engine: n8n
  Containerization: Docker, Docker Compose
  Testing: Jest (Unit), Supertest (API), Cypress (E2E)
  CI/CD: GitHub Actions

Known Limitations
  n8n Workflow: The included n8n workflow is a simple "wait and call back" process to demonstrate the round-trip. A real-world workflow would involve more complex logic.
  
  UI State Management: For simplicity, UI state is managed with React Context and simple polling/WebSockets. For a larger application, a more robust library like Redux Toolkit or Zustand would be considered.
  
  Error Handling: Basic error handling is in place. A production environment would require more comprehensive logging and error reporting.
