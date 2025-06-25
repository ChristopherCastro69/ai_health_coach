---
title: AI Health Coach
description: Full-stack AI-powered health coach app
---

sequenceDiagram
    participant U as User
    participant F as Frontend (React/Vite)
    participant B as Backend (Django)
    participant DB as MySQL

    U->>F: Enters food (e.g. "I had pizza today")
    F->>B: POST /api/food-entry-ai/ { message }
    B->>B: AI processing (Ollama or local model)
    B->>DB: Create food entry
    B-->>F: AI response (created entries)
    F-->>U: Show AI message in chat

    U->>F: Selects a date on calendar
    F->>B: GET /api/food-entries/history/?date=YYYY-MM-DD
    B->>DB: Query food entries for date
    B-->>F: List of food entries
    F-->>U: Show entries and daily summary

## Quick Start (Docker)

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd ai_health_coach
   ```

2. **Create a `.env` file in the project root:**

   ```env
   MYSQL_DATABASE=health_coach_db
   MYSQL_USER=healthuser
   MYSQL_PASSWORD=healthpass
   MYSQL_ROOT_PASSWORD=rootpass

   DJANGO_SECRET_KEY=your-secret-key
   DJANGO_DEBUG=True
   DJANGO_ALLOWED_HOSTS=*

   DB_NAME=health_coach_db
   DB_USER=healthuser
   DB_PASSWORD=healthpass
   DB_HOST=db
   DB_PORT=3306

   VITE_API_BASE_URL=http://backend:8000
   ```

3. **Build and start all services:**

   ```sh
   docker-compose up --build
   ```

4. **Apply Django migrations:**

   ```sh
   docker-compose exec backend python manage.py migrate
   ```

5. **(Optional) Create a Django superuser:**

   ```sh
   docker-compose exec backend python manage.py createsuperuser
   ```

6. **Access the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - MySQL: localhost:3306 (use credentials from `.env`)

---

## Local Development (Without Docker)

### Backend

1. **Install Python dependencies:**

   ```sh
   cd server
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

2. **Configure your database in `server/health_coach/health_coach/settings.py`.**

3. **Run migrations and start the server:**
   ```sh
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend

1. **Install Node dependencies:**

   ```sh
   cd client
   npm install
   ```

2. **Set API base URL in `.env` (in `client/`):**

   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Start the dev server:**
   ```sh
   npm run dev
   ```

---

## Environment Variables

- All environment variables for Docker Compose are set in the root `.env` file.
- For local frontend dev, set `VITE_API_BASE_URL` in `client/.env`.

---

## API Endpoints

- **Check Ollama:** `GET /api/check-ollama/`
- **Check Model:** `GET /api/check-model/`
- **Food Entries:** `GET/POST /api/food-entries/`
- **Food Entry AI:** `POST /api/food-entry-ai/`
- **Health Insight:** `POST /api/health-insight/`
- ...and more (see Django REST API code for details)

---

## Useful Commands

- **Stop all containers:**  
  `docker-compose down`
- **Rebuild after code changes:**  
  `docker-compose up --build`
- **View logs:**  
  `docker-compose logs -f`

---

## Troubleshooting

- If you see MySQL connection errors, ensure the database service is healthy and Django is using the correct credentials.
- If the frontend cannot reach the backend, check that `VITE_API_BASE_URL` is set correctly and both services are running.

---

## License

MIT

---

## Contributors

- Christopher Castro

---
