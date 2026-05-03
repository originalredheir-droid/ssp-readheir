# ssp-readheir

## Project structure

- `backend/` - Django REST API scaffold with PostgreSQL tenant-aware models and middleware
- `frontend/` - React + Vite + Tailwind web app scaffold
- `refrence/` - design and page references for UI implementation

## Getting started

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Notes

- The backend uses token authentication and supports tenant-aware APIs.
- PostgreSQL RLS policies are defined in `backend/apps/core/db_policies.sql` for later deployment.
- The frontend uses `VITE_API_BASE_URL` for the API endpoint.
