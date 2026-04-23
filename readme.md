# CRM System (Technical Assessment)

## Tech Stack
- Backend: ASP.NET Core Web API, EF Core, SQL Server, JWT
- Frontend: React (Hooks, Axios)

## Features
- User authentication (JWT)
- Properties CRUD
- Clients CRUD
- Associate clients with properties
- Secure endpoints per user

## How to Run

### Backend
cd backend
dotnet restore
dotnet ef database update
dotnet run

### Frontend
cd frontend
npm install
npm start

## API Base URL
http://localhost:5039/api