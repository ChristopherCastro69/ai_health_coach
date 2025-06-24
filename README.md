# AI Health Coach

## Structure

- `backend/`: Django REST API
- `frontend/`: React (Vite) UI

## Setup

### Backend
```sh
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```sh
cd frontend
npm install
npm run dev
```
`

