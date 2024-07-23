
# AfterLife RP server website

see below for instructions

# Discord Authentication Module

This module enables user authentication via Discord for a Node.js backend application using Express and MongoDB. It includes handling user sessions, user data management, and ensuring certain users have admin privileges.

## Features

- Discord OAuth2 authentication.
- User session management with Passport.js.
- Automatic user data retrieval and update on login.
- Persistent `isAdmin` status.
- Endpoints to handle authentication, logout, and user data retrieval.

## Environment Variables

Create a `.env` file in the root of your project with the following values:

```env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_CALLBACK_URL=your_discord_callback_url
```

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/your-repository.git
    cd your-repository
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up your `.env` file:**
    Add the necessary environment variables as shown in the "Environment Variables" section.

4. **Run the server:**
    ```sh
    npm run start
    ```

## File Structure

Here’s the main file structure related to the authentication module:

```
backend/
├── src/
│   ├── models/
│   │   └── User.ts
│   ├── routes/
│   │   └── auth.ts
│   ├── server.ts
├── .env
```

### `auth.ts`

The main routes and authentication logic for logging in with Discord, handling sessions, and managing user data.

### `User.ts`

Mongoose model for user data, including fields like `discordId`, `username`, `avatar`, and `isAdmin`.

### `server.ts`

Entry point of the server, where Express app is initialized and middleware, including Passport, is configured.

## API Endpoints

### `GET /auth/discord`

Redirects the user to Discord for authentication.

### `GET /auth/discord/callback`

Callback URL for Discord to redirect to after authentication. Handles user login and creation logic.

### `GET /auth/logout`

Logs the user out of the current session.

### `GET /auth/me`

Returns the authenticated user's data if they are logged in.

## Middleware

### `isAuthenticated`

Ensures that the requested route is only accessible to authenticated users.

## Example Usage

### Retrieving User Data

Make an authenticated request to `/auth/me` to retrieve the current user's information:

```sh
curl -X GET http://localhost:3000/auth/me -H "Authorization: Bearer <your_token>"
```

### Logging Out

Make a request to `/auth/logout` to log the user out of the session:

```sh
curl -X GET http://localhost:3000/auth/logout
```

## Contributing

1. Fork the repository.
2. Create a new feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request.

## License

This project is licensed under the MIT License.
