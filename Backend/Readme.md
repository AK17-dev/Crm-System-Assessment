# Technical Assessment - Abdelkader Khanji

## Backend
Built with:
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication

## Features
- User registration & login
- JWT authentication
- Properties CRUD (user-specific)
- Clients CRUD (linked to properties)
- Authorization (users only access their own data)

## How to Run

1. Install dependencies:dotnet restore

2. Run migrations:dotnet ef database update

3. Run the project:dotnet run

4. Open Swagger:http://localhost:5039/swagger

## ER Diagram
See ER-Diagram.png