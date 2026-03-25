# 🌤 WeatherWise — Full-Stack Weather Intelligence App

A full-stack weather application that provides structured weather insights, date-range queries, smart advice, and map-based visualization.

---

## 👤 Author

**Qing Qin**  
Email: 1450349258@qq.com  

---


## 🚀 Features

### 🔍 Weather Query
- Search by **city / postal code / coordinates**
- Retrieve:
  - Current weather
  - 5-day forecast (OpenWeather API)
  - Smart travel advice

---

### 📅 Date Range Filtering
- Users can select a **custom date range (within 5 days)**
- System filters forecast results dynamically
- Validates:
  - Date order
  - Allowed range

---

### 🗄 Database (CRUD)
- Store weather queries in database
- Features:
  - Create records
  - Read history (no user isolation required)
  - Update weather records
  - Delete records

---

### 🧠 Structured Backend Design
- Controller → Service → Database architecture
- Location resolver (city / zip / coordinates)
- Centralized error handling (AppError)

---

### 🗺 Map Integration
- Displays queried location using **Leaflet + OpenStreetMap**
- Automatically updates based on search input

---

### 📤 Data Export
Supports exporting records as:
- JSON
- CSV
- Markdown

---

## 🧱 Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- React DatePicker
- React Leaflet

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM

### API
- OpenWeather API
- OpenStreetMap

---

## ⚙️ Project Structure
client/
components/
pages/

server/
controllers/
services/
routes/
prisma/


---

## ▶️ How to Run

### 1. Install dependencies

```bash
npm install
cd client && npm install
cd ../server && npm install
```
### 2. Setup environment
Create:
```bash
OPENWEATHER_API_KEY=your_api_key
DATABASE_URL=your_database_url
```
### 3. Run backend
```bash
cd server
npx prisma migrate dev
npm run dev
```
### 4. Run frontend
```bash
cd client
npm run dev
```