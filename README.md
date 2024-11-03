# Parking Management System

Welcome to the Parking Management System! This web application is developed by me which helps manage parking slots, keeps real-time updates of the number of parked vehicles, assigns slots to incoming vehicles, and calculates the total parking cost based on the duration for both two-wheelers and four-wheelers.

# Features

- Real-time updates of the number of parked two-wheelers and four-wheelers.
- Displays total slots available for parking.
- Assigns slots to incoming vehicles.
- Evaluates the total parking cost for two-wheelers and four-wheelers based on parking duration.

# Usage

1. Dashboard: View real-time updates of parked vehicles and available slots.
2. Assign Slot: Add a new vehicle and assign a parking slot.
3. Slot avaibility: keep record of slots availble for parking.
4. Calculate Cost: Check out a vehicle and calculate the parking fee based on the duration.

# Demo

![image](https://github.com/Saunakushwaha/Car_parking/assets/131192666/03b6a9ae-9607-40c3-a592-da9d39e12a97)
![image](https://github.com/Saunakushwaha/Car_parking/assets/131192666/a8fce269-f7b6-4604-9e51-288b19477c7e)
![image](https://github.com/Saunakushwaha/Car_parking/assets/131192666/bf0a5172-42aa-4647-a921-b890ba078fb6)
![image](https://github.com/Saunakushwaha/Car_parking/assets/131192666/e2a0f26e-4434-430d-8114-54f03a248814)
![image](https://github.com/Saunakushwaha/Car_parking/assets/131192666/bd8e3b1f-ae6e-4710-b049-2f03c643e0bc)

# Tech Stack

- **Frontend**: React.js with Bootstrap CSS framework
- **Backend**: Node.js and Express.js
- **Database**: MySQL

# Installation

## Prerequisites

- Node.js and npm installed on your local machine
- MySQL installed and running

## Steps

1. Clone the repository:
   ```console
   git clone https://github.com/yourusername/parking-management-system.git
   cd parking-management-system
   ```
2. Install frontend dependencies:
   ```console
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```console
   cd ../backend
   npm install
   ```
4. Set up the MySQL database:
   - Create a database named **_parking_db_**.
   - Run the SQL script located at **_backend/db/schema.sql_** to create the necessary tables.
5. Configure environment variables:
   Create a .env file in the backend directory with the following content:
   ```javascript
   DB_HOST = your_db_host;
   DB_USER = your_db_user;
   DB_PASSWORD = your_db_password;
   DB_NAME = parking_db;
   ```
6. Start the backend server:
   ```console
   nodemon server.js
   ```
7. Start the frontend server:
   ```console
   npm start
   ```
8. Access the application:
   Open your web browser and navigate to **_http://localhost:3000_**.
