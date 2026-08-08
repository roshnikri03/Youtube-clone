# YouTube Clone

A MERN stack YouTube clone built with React, React Router, Axios, Express, MongoDB, JWT, and Multer.

## Features

- YouTube-style responsive header, toggleable sidebar, category filters, and video grid
- Search videos by title from the header search bar
- Register and log in with JWT authentication and bcrypt password hashing
- Watch videos with a player, metadata, likes, dislikes, and comments
- Add, edit, and delete comments when authenticated
- Create one channel per user and manage uploaded videos from the channel page
- Upload video and thumbnail files through the protected channel workflow
- MongoDB relationships between users, channels, videos, and comments

## Links

- Video demonstration: [Google Drive](https://drive.google.com/file/d/1CWinUTxIQpESr38j0X-T1Q95gJnW1dzk/view?usp=sharing)
- GitHub repository: [Youtube-clone](https://github.com/roshnikri03/Youtube-clone)

## Project Structure

```text
backend/
	config/          MongoDB connection
	controllers/     API business logic
	middleware/      JWT protection and file uploads
	models/          MongoDB schemas
	routes/          Express route definitions
	server.js        API entry point
	seed.js          Sample dataset loader
frontend/
	src/components/ Shared header and sidebar
	src/context/    Authentication session state
	src/pages/      Home, auth, channel, and watch pages
	src/App.jsx     Router and application shell
```

## Requirements

- Node.js 18 or newer
- MongoDB Atlas or a local MongoDB server
- A terminal opened in the project directory

## Configuration

Set these environment variables before starting the backend:

```bash
export MONGODB_URI="mongodb://127.0.0.1:27017/youtube-clone"
export JWT_SECRET="replace-with-a-long-random-secret"
```

For MongoDB Atlas, replace `MONGODB_URI` with the Atlas connection string. Do not commit connection strings or JWT secrets to Git.

## Installation and Running

Install each workspace separately:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Start the backend in one terminal:

```bash
cd backend
npm start
```

Start the Vite frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open `http://127.0.0.1:5173/`. The API runs on `http://localhost:5001`.

## Sample Data

After configuring MongoDB, load the sample user, channel, videos, and comment:

```bash
cd backend
node seed.js
```

The seed script clears the existing collections before inserting its sample dataset. Use it only in development or in a disposable database.

## API Overview

| Area | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| Auth | `POST /api/auth/register` | Public | Register a user |
| Auth | `POST /api/auth/login` | Public | Log in and receive a JWT |
| Channels | `POST /api/channels` | Protected | Create a channel |
| Channels | `GET /api/channels/my-channel` | Protected | Load the signed-in user's channel |
| Channels | `GET /api/channels/:id` | Public | Load a channel and its videos |
| Videos | `GET /api/videos` | Public | Search and filter videos |
| Videos | `GET /api/videos/:id` | Public | Load one video and increment views |
| Videos | `POST /api/videos` | Protected | Upload a video and thumbnail |
| Videos | `PUT /api/videos/:id` | Protected | Update an owned video |
| Videos | `DELETE /api/videos/:id` | Protected | Delete an owned video |
| Comments | `GET /api/comments/video/:videoId` | Public | List comments |
| Comments | `POST /api/comments` | Protected | Add a comment |
| Comments | `PUT /api/comments/:id` | Protected | Edit the author's comment |
| Comments | `DELETE /api/comments/:id` | Protected | Delete the author's comment |

Protected requests use the header `Authorization: Bearer <token>`.

## Validation

```bash
cd backend
node --check server.js

cd ../frontend
npm run build
```

The frontend uses Vite and the backend uses ES modules, matching the project requirements.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
