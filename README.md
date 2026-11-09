# Kanban Board

A collaborative kanban board application for organizing work into boards, columns, and cards. The project includes a React and Vite frontend and an Express API backed by MongoDB. Users can register and sign in, manage boards and tasks, collaborate with board and card members, and use features such as checklists, comments, activity history, notifications, and real-time updates.

## Features

- Register, sign in, and manage a user profile.
- Create and manage boards, columns, and cards.
- Reorder and move cards between columns with drag and drop.
- Edit task details, attach images, and track checklist items.
- Invite collaborators to boards and cards.
- Add comments and review activity and notifications.
- Receive live updates through Socket.IO.

## Prerequisites

- Node.js and npm.
- MongoDB running locally. The backend connects to `mongodb://127.0.0.1:27017/kanban`.
- A Cloudinary account if you want to upload profile or card images.

## Installation

1. Clone the repository and enter the project directory:

   ```bash
   git clone <repository-url>
   cd kanban-board
   ```

2. Install frontend and backend dependencies:

   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```

3. Configure the backend environment. Create `backend/.env`:

   ```dotenv
   JWT_SECRET=replace-with-a-long-random-secret

   # Optional: needed for image uploads
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_KEY=your-cloudinary-api-key
   CLOUDINARY_SECRET=your-cloudinary-api-secret
   ```

   Keep real credentials out of version control. `JWT_SECRET` is used to sign login tokens. Cloudinary settings can be omitted if you do not use image uploads. The backend loads `.env` outside production; set these values in the production environment when deploying.

4. Start MongoDB, then start the backend in one terminal:

   ```bash
   cd backend
   node index.js
   ```

   The API and Socket.IO server listen on `http://localhost:3000`.

5. In another terminal, from the project root, start the frontend:

   ```bash
   npm run dev
   ```

   Open the Vite URL printed in the terminal (normally `http://localhost:5173`). The current frontend API configuration and backend CORS policy expect the frontend at this address and the backend at port `3000`.

## Usage

1. Open the frontend and choose **Register** to create an account, or **Login** if you already have one.
2. From the boards page, create a board and open it.
3. Add columns to represent workflow stages, then add cards for the work to track.
4. Drag cards to reorder them or move them between columns. Open a card to edit its details, manage its checklist, add comments, or invite collaborators.
5. Use the navigation and profile pages to view activity, notifications, and user information.

The application routes include:

- `/` or `/boards` — board list.
- `/columns/:boardId` — a board and its columns.
- `/login` and `/register` — authentication.
- `/profile/:username` — a user profile.

The backend exposes its API on port `3000`. For example, `POST /register` creates an account, `POST /login` signs in, and authenticated board routes are under `/boards`. Authentication uses an HTTP-only cookie; API requests from the frontend include credentials.

## Project structure

```text
.
├── backend/       Express API, MongoDB models, routes, and Socket.IO
├── public/        Static public assets
└── src/           React application, pages, components, and API clients
```

## Development commands

Run these from the project root:

```bash
npm run dev       # Start the Vite development server
npm run build     # Build the frontend for production
npm run preview   # Preview the production frontend build
npm run lint      # Run ESLint
```

The backend currently has no automated test suite configured.

## Contributing

Contributions and bug reports are welcome. To contribute:

1. Fork the repository and create a focused branch from the default branch.
2. Make a change that follows the existing project structure and coding style.
3. Run `npm run lint` and `npm run build` from the project root, and manually verify backend changes against a local MongoDB instance.
4. Open a pull request describing the change, how it was verified, and any relevant screenshots or configuration changes.

For significant behavior changes, explain the intended user impact in the pull request. Do not commit credentials, `.env` files, or other private configuration.
