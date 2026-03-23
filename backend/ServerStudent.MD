# Server Setup Notes

## Starting the Server
- Run `node server.js` to start the backend
- Server runs on http://localhost:4000
- Must be running before the mobile app can connect

## Environment Variables
- config.env contains credentials for the server
- Never commit config.env to GitHub
- Always verify it is listed in .gitignore

## What I Observed
- server.js is the entry point for the backend
- The server listens on port 4000
- Confirmed working by visiting http://localhost:4000 in browser