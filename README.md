# FullStack Zomato Clone

A food-ordering web app built with React (Vite) frontend and Django REST backend.

## Tech Stack
- Frontend: React 19, Vite, React Router, Axios
- Backend: Django 5, Django REST Framework, SimpleJWT
- Database: SQLite (default local) or PostgreSQL (optional)

## Project Structure
```text
ZomatoFullStackapp/
  backend/   # Django API
  frontend/  # React app
```

## Features
- Browse foods by category
- Search foods by name/description/category
- Add/remove cart items
- Checkout and place order
- JWT login/signup
- View previous orders

## Prerequisites
- Python 3.11+
- Node.js 18+
- npm

## Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python populate_food.py
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000`

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Environment Variables
Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Backend DB options (optional):
- Default local: SQLite (no extra config required)
- PostgreSQL: set
```env
DB_ENGINE=postgres
DB_NAME=tomatodb
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

Or use:
```env
DATABASE_URL=postgres://user:pass@host:5432/dbname
```

## API Endpoints
- `GET /api/foods/`
- `GET /api/foods/?category=<name>`
- `GET /api/categories/`
- `POST /api/register/`
- `POST /api/token/`
- `POST /api/token/refresh/`
- `POST /api/orders/` (auth required)
- `GET /api/previous-orders/` (auth required)

## Common Commands
```bash
# backend
python manage.py check
python manage.py showmigrations

# frontend
npm run build
npm run preview
```

## Notes
- Seed data script assigns local media images for food items.
- If images don�t refresh immediately, hard refresh browser (`Ctrl+F5`).
