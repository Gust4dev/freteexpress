# Frete Express - Docker Setup

This project is containerized using Docker.

## Prerequisites

- Docker
- Docker Compose

## How to Run

1.  **Build and Start:**
    ```bash
    docker-compose up --build
    ```

2.  **Access the Application:**
    - Frontend: [http://localhost:5050](http://localhost:5050)
    - Backend: [http://localhost:3000](http://localhost:3000)
    - MongoDB: `mongodb://localhost:27017`

## Services

-   **frontend**: React application served by Nginx.
-   **backend**: Node.js/Express API.
-   **mongo**: MongoDB database.

## Environment Variables

Ensure you have `.env` files in `backend/` and `frontend/` if needed, although the `docker-compose.yml` sets some defaults.
