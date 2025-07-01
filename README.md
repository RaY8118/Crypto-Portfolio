# Crypto Portfolio Tracker

This is a full-stack application designed to help users track their cryptocurrency portfolios. It features a secure backend API built with FastAPI and a responsive frontend built with React.

## Features

### Backend
- **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
- **Portfolio Management:** API endpoints to manage user portfolios, including adding, updating, and deleting crypto assets.
- **Trade Tracking:** Functionality to record and track cryptocurrency trades.
    - **Real-time Price Data:** Integration to fetch real-time cryptocurrency prices using the Binance API.
- **Database:** Uses SQLite for data storage (indicated by `crypto_portfolio.db`).

### Frontend
- **User Interface:** A modern and responsive user interface built with React.
- **Authentication Flows:** User registration, login, and protected routes.
- **Dashboard:** A dashboard to display portfolio overview.
- **Routing:** Client-side routing using React Router DOM.
- **Styling:** Styled with Tailwind CSS.

## Technologies Used

### Backend
- **Framework:** FastAPI
- **Database:** SQLite (via SQLAlchemy ORM)
- **Authentication:** PyJWT
- **Dependency Management:** uv (or pip/Poetry)

### Frontend
- **Framework:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **API Client:** Axios
- **State Management:** React Context API (for authentication)

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js (LTS recommended)
- bun (or npm/yarn)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    uv sync
    # or if using pip:
    # pip install -r requirements.txt
    # (you might need to generate requirements.txt from pyproject.toml first)
    ```

3.  **Start the backend server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend API will typically run on `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    # or if using npm:
    # npm install
    # or if using yarn:
    # yarn install
    ```

3.  **Start the frontend development server:**
    ```bash
    bun dev
    # or if using npm:
    # npm run dev
    ```
    The frontend application will typically run on `http://localhost:5173` (or another port as configured by Vite).

## Usage

1.  **Register a new user** or **Log in** with existing credentials on the frontend.
2.  Once logged in, you will be redirected to the **Dashboard**.
3.  From the dashboard, you can manage your cryptocurrency portfolio and track trades.

