# Vedio App

Premium video streaming app with a Node/Express backend and a React + Tailwind frontend.

## Project Structure

- backend: root folder (Express, MongoDB, Cloudinary)
- frontend: frontend/ (Vite + React + Tailwind)

## Backend Setup

1. Install dependencies:
   - npm install
2. Create a .env file in the root folder with:
   - PORT=8000
   - MONGODB_URI=mongodb://localhost:27017
   - CLOUDINARY_CLOUD_NAME=your_cloud_name
   - CLOUDINARY_API_KEY=your_api_key
   - CLOUDINARY_API_SECRET=your_api_secret
   - ACCESS_TOKEN_SECRET=your_access_secret
   - ACCESS_TOKEN_EXPIRY=1d
   - REFRESH_TOKEN_SECRET=your_refresh_secret
   - REFRESH_TOKEN_EXPIRY=7d
3. Run the backend:
   - npm run dev

Backend runs on http://localhost:8000

## Frontend Setup

1. Go to the frontend folder:
   - cd frontend
2. Install dependencies:
   - npm install
3. Copy env example and adjust if needed:
   - copy .env.example .env (Windows)
4. Run the frontend:
   - npm run dev

Frontend runs on http://localhost:5173

## API Overview (selected)

- POST /api/v1/users/register
- POST /api/v1/users/login
- POST /api/v1/users/logout
- GET /api/v1/users/me
- GET /api/v1/videos
- POST /api/v1/videos
- GET /api/v1/videos/:id
- GET /api/v1/videos/:videoId/comments

## Notes

- Frontend uses VITE_API_URL to target the backend API.
- File uploads use multipart/form-data and require Cloudinary credentials.
