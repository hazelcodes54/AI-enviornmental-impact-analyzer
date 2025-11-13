# AI Environmental Impact Analyzer

A full-stack application that uses AI to analyze the environmental impact of consumer products based on product descriptions, manufacturing details, and supply chain information.

## Features

- 🌍 **AI-Powered Analysis**: Utilizes OpenAI to analyze product environmental impact
- 📊 **Environmental Footprint Score**: Generates comprehensive scores for products
- 🔐 **User Authentication**: Secure user registration and login
- 📈 **Product History**: Track and compare environmental impacts over time
- 🎨 **Modern UI**: React-based responsive interface

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- OpenAI API
- JWT Authentication

### Frontend
- React + TypeScript
- Vite
- React Router
- Recharts for data visualization
- Axios for API calls

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Add your MongoDB URI and OpenAI API key

4. Start the development servers:
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

## Project Structure

```
├── backend/          # Express API server
│   ├── src/
│   │   ├── models/   # MongoDB models
│   │   ├── routes/   # API routes
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/ # AI analysis service
│   │   └── server.ts
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
└── package.json      # Root package.json
```

## API Endpoints

Coming soon...

## License

MIT
